# TIKI Shopify App
TIKI Shopify App uses the TIKI SDK JavaScript to implement the TIKI Zero Party Data infrastructure into the Shopify store.

Instead of prompting the users with boring traditional low converting cookie banners, create compelling offers.

The TIKI Shopify App makes it simple to create offers in the form of discounts to incentivize users to allow cookies.

### Requires

- A [Shopify Store](https://www.shopify.com/).

## How it works
TIKI Shopify App offers customers a discount in exchange for consenting to the use of cookies.

The discount is applied in a new [Customer Segment](https://help.shopify.com/en/manual/customers/customer-segmentation/customer-segments) created by the app: the TIKI User Segment.

Upon a user's first visit, the app presents the offer through a banner. If the user accepts the offer, a license is created in the TIKI infrastructure. 

If the user is already registered in the store, it is added to a the TIKI User Segment in Shopify. If the user is not logged in, their TIKI ID is saved in the browser's cookies, and the user is added to the TIKI User segment upon their first login. 

The discount is automatically applied during checkout for all users in the TIKI User Segment, after confirming that the License to use cookies is still active. If the License was revoked, the customer is removed from the TIKI User Segment and the discount is not applied.

### Limits
#### Cookie auto block
The app does not block cookies based on user consent. Instead, we instruct [Shopify Privacy API](https://shopify.dev/docs/api/consent-tracking) about the consent collected from the user. Any app that use cookies in Shopify should rely on this API, but we cannot ensure that every installed app in your store does. 

## Get Started
### Installation
1. Log in to the [Shopify App Store](https://apps.shopify.com/).
2. Search for the TIKI app and then click it.
3. On the app listing page, click Add app.
4. In your Shopify admin, to authorize the use of the app, click Install app.

Upon app installation, you will be guided through the configuration screens.

### TIKI SDK Configuration
The first configuration screen is the TIKI SDK API Keys. To enable communication between the plugin and the TIKI infrastructure, you need to obtain API keys.
1. Click on the [TIKI Console](https://console.mytiki.com) link to acquire the API keys. Another tab will be open.
2. Create a new project or select an existing one.
3. Generate a Private Key for the project.
4. Take note of the Private Key ID, Private Key Secret, and Publishing ID.
5. Go back to the onboarding screen and enter the API Keys.
6. Click "next" to save the keys.

### Offer Configuration
The second screen configures the options for the offer:

- **Discount Type**: Wether the discount will be a fixed value or a percentage or the cart total.
- **Discount Value**: The numeric value of the discount. It can be a percentage or a fixed value, depending on the discount type. Accepts up to 2 decimal numbers.	
- **Description**: Small text to add user-friendly details to the Offer. We recommend including details like the type of data the user is trading and participation requirements (like 10% off your next purchase of $10 or more).
- **Offer image**: A 300 x 86 resolution image that illustrates the offer. We've elected to make this portion of the UI an image; so you can get as fancy/detailed as you'd like. We strongly recommend the image to be compelling, easy to understand, and focused on the incentive for the user to participate (hence, why it's called the reward image). The reward always goes hand in hand with the text Description (like a caption), so avoid over crowding it with too much text.
- **Offer use case 1, 2 and 3**: The bullets that will explain to the user how their data will or will NOT be used. When creating your bullets, it's important to use terminology users are familiar with. Words like attribution, lead to confusion and lower opt-in rates.
- **Offer terms**: The terms and conditions for this offer agreement. It should be a URL to a plain text file containing the legal conditions. This file can include simple markdown formatting.

After configuring the discount offer, click "Save and add to store" to save the UI settings. You will be redirected to the Theme Editor to configure the UI.

### UI Personalization
The TIKI banner is added as a block in the storefront theme's footer. 
In the Theme Editor you can personalize the look of the banner to match your site colors. To preview the banner click in the "preview" checkbox. 

The appearance of the UI components is customized using the following settings.

**Colors**
- Primary Text Color - default `#00001C` ![#00001C](https://placehold.co/15x15/00001C/00001C.png) ,
- Secondary Text Color - default `#9900001C` ![#9900001C](https://placehold.co/15x15/1C0000/1C0000.png) -> with alpha 60%, 
- Primary_background color - default `#FFFFFF` ![#FFFFFF](https://placehold.co/15x15/FFFFFF/FFFFFF.png) ,
- Secondary_background color - default `#F6F6F6` ![#F6F6F6](https://placehold.co/15x15/F6F6F6/F6F6F6.png),
- Accent color - default ![#00b272](https://placehold.co/15x15/00b272/00b272.png) `#00b272`,

**Font**

Before using a custom font family make sure to [set it with @fontface using CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face).

- Font Family - default "Space Grotesk"

After configuring the appearence of the banner, click "Save" in the top right corner.

### That's it!
Open a new browser window and go to your website's homepage. If everything is set up correctly, you should see the TIKI banner as configured in the Theme Editor.
