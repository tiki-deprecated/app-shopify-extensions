/* global TikiSdk,TIKI_SETTINGS,ShopifyAnalytics,_st,Shopify */

const tikiId = 'tiki-offer'
const tikiOverlayId = 'tiki-offer-overlay'

window.addEventListener('load', async (event) => {
  if (TIKI_SETTINGS.customerId) {
    await tikiSdkConfig()
      .ptr(TIKI_SETTINGS.customerId.toString())
      .add()
      .initialize(TIKI_SETTINGS.publishingId, TIKI_SETTINGS.customerId)
    const tikiDecisionCookie = document.cookie.match(/(?:^|;\s*)tiki_decision=([^;]*)/)
    if (tikiDecisionCookie) {
      tikiHandleDecision()
    } else {
      // const title = await TikiSdk.Trail.Title.getByPtr(TIKI_SETTINGS.customerId.toString())
      // if (title) {
      //     const license = await TikiSdk.Trail.License.getLatest(title.id)
      //      if(license){
      //         console.log("The user has a valid License. Banner will not be shown.")
      //         return
      //      }
      // }
      tikiAnon()
    }
  } else {
    if (!Shopify.designMode || TIKI_SETTINGS.UI.preview === 'true') {
      const tikiDecisionCookie = document.cookie.match(/(?:^|;\s*)tiki_decision=([^;]*)/)
      if (!tikiDecisionCookie) {
        tikiSdkConfig().add()
        tikiAnon()
      }
    }
  }
})

const tikiGetOrCreateTitle = async (offer) => {
  let title = await TikiSdk.Trail.Title.getByPtr(offer._ptr)
  if (!title) {
    title = await TikiSdk.Trail.Title.create(
      offer._ptr,
      offer._tags,
      "desc"
    )
  }
  return title
}

const tikiAnon = () => {
  const tikiLicencedCookie = document.cookie.match(/(?:^|;\s*)tiki_licensed=([^;]*)/)
  if (TIKI_SETTINGS.discount && document.getElementById(tikiId) == null && !tikiLicencedCookie) {
    const div = document.createElement('div')
    div.id = tikiId
    div.appendChild(tikiAnonCreateOverlay())
    document.body.appendChild(div)
    tikiAnonGoTo('prompt')
  }
}

const tikiAnonGoTo = async (step) => {
  switch (step) {
    case 'none': {
      const element = document.getElementById(tikiId)
      if (element != null) element.remove()
      break
    }
    case 'prompt': {
      const offerPrompt = TikiSdk.UI.Screen.Prompt.create(
        TikiSdk.config()._offers[0],
        () => {
          offerPrompt.remove()
          tikiAnonGoTo('terms')
        },
        () => {
          if (!Shopify.designMode) {
            tikiHandleDecision(false)
          }
          offerPrompt.remove()
        },
        () => {
          offerPrompt.remove()
          tikiAnonGoTo('learnMore')
        },
        TikiSdk.config().activeTheme
      )
      tikiAnonShowScreen(offerPrompt)
      break
    }
    case 'learnMore': {
      const learnMore = TikiSdk.UI.Screen.LearnMore.create(() => {
        learnMore.remove()
        tikiAnonGoTo('prompt')
      }, TikiSdk.config().activeTheme)
      tikiAnonShowScreen(learnMore)
      break
    }
    case 'terms': {
      const terms = await TikiSdk.UI.Screen.Terms.create(
        {
          src: TikiSdk.config()._offers[0]._terms.src,
          isHtml: true
        },
        async () => {
          if (!Shopify.designMode) {
            tikiHandleDecision(true)
          }
          terms.remove()
        },
        () => {
          terms.remove()
          tikiAnonGoTo('prompt')
        },
        TikiSdk.config().activeTheme
      )
      tikiAnonShowScreen(terms)
      break
    }
  }
}

const tikiAnonShowScreen = (screen) => {
  const div = document.getElementById(tikiId)
  if (div != null) {
    div.appendChild(screen)
  }
}

const tikiAnonCreateOverlay = () => {
  const overlay = TikiSdk.UI.Element.Overlay.create(() => tikiAnonGoTo('none'))
  overlay.id = tikiOverlayId
  return overlay
}

const tikiSdkConfig = () => {
  return TikiSdk.config()
    .theme
    .primaryTextColor(TIKI_SETTINGS.UI.primaryTextColor)
    .secondaryTextColor(TIKI_SETTINGS.UI.secondaryTextColor)
    .primaryBackgroundColor(TIKI_SETTINGS.UI.primaryBackgroundColor)
    .secondaryBackgroundColor(TIKI_SETTINGS.UI.secondaryBackgroundColor)
    .accentColor(TIKI_SETTINGS.UI.accentColor)
    .fontFamily(TIKI_SETTINGS.UI.fontFamily)
    .and()
    .offer
    .description(TIKI_SETTINGS.UI.description)
    .reward(TIKI_SETTINGS.UI.offerImage)
    .bullet(TIKI_SETTINGS.UI.bullet1)
    .bullet(TIKI_SETTINGS.UI.bullet2)
    .bullet(TIKI_SETTINGS.UI.bullet3)
    .terms(TIKI_SETTINGS.UI.terms)
    .tag(TikiSdk.Trail.Title.TitleTag.deviceId())
    .use({ usecases: [TikiSdk.Trail.License.LicenseUsecase.attribution()], destinations: ['*'] })
}

const tikiHandleDecision = async (accepted) => {
  if (!TIKI_SETTINGS.customerId) {
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    document.cookie = `tiki_decision=true; expires=${expiry.toUTCString()}; path=/`;
  } else {
      const offer = TikiSdk.config()._offers[0]
      let title = await tikiGetOrCreateTitle(offer)
      let license = await TikiSdk.Trail.License.create(
        title.id,
        accepted ? offer._uses : [],
        offer._terms.src,
        offer._description,
        offer._expiry
      )
      if (accepted) {
        const payable = await TikiSdk.Trail.Payable.create(
          license.id,
          TIKI_SETTINGS.discount.amount.toString(),
          TIKI_SETTINGS.discount.type,
          TIKI_SETTINGS.discount.description,
          TIKI_SETTINGS.discount.expiry,
          TIKI_SETTINGS.discount.reference,
        )
        if (payable) {
          tikiSaveCustomerDiscount(TIKI_SETTINGS.customerId, TIKI_SETTINGS.discount.reference)
        }
      }
  }
}

const tikiSaveCustomerDiscount = async (customerId, discountId) => {
  const shop = Shopify.shop
  const customerDiscountBody = JSON.stringify({
    shop,
    customerId,
    discountId,
  })
  const authToken = await TikiSdk.IDP.Auth.token()
  const xTikiAddress = TikiSdk.Trail.address()
  const customerDiscountByteArray = new TextEncoder('utf8').encode(customerDiscountBody)
  const xTikiAddressSigUint = await TikiSdk.IDP.Key.sign(TIKI_SETTINGS.customerId, customerDiscountByteArray)
  const xTikiAddressSig = b64Encode(xTikiAddressSigUint)
  const headers = {
    'Authorization': `Bearer ${authToken.accessToken}`,
    'X-Tiki-Address': xTikiAddress,
    'X-Tiki-Signature': xTikiAddressSig
  }
  fetch(`https://intg-shpfy.pages.dev/api/latest/customer/discount`, {
    method: 'POST',
    headers,
    body: customerDiscountBody
  })
    .then(response => response.text())
    .then(response => {
      console.log(`Discount saved! ${response}`)
      const expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + 1);
      document.cookie = `tiki_licensed=true; expires=${expiry.toUTCString()}; path=/`;
    })
    .catch(err => console.error(err));
}

const b64Encode = (bytes) => btoa(bytes.reduce((acc, current) => acc + String.fromCharCode(current), ""));

const b64Decode = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));