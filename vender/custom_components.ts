/**
 * You can switch which implementation to be used for the components below.
 * - AppLogo
 * - Footer
 * - Social
 */
import type { ICustomComponents } from "@src/js/component/app"
import AppLogo from "@vender/component/app_logo/default/app_logo"
import Footer from "@vender/component/footer/default/footer"
import Social from "@vender/component/social/default/social"

const CustomComponents: ICustomComponents = {
    Footer,
    Social,
    AppLogo,
}

export default CustomComponents
