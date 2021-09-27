import React from "react";
import { RecoilRoot } from "recoil";
import styles from "./index.module.css"
import { ViewerContainer } from "@src/js/component/ViewerContainer/viewer_container";

export default {
    title: 'SCOPin/ViewerContainer',
    component: ViewerContainer,
    decorators: [
        (Story) => <RecoilRoot><div className={styles.root}>{Story()}</div></RecoilRoot>
    ],
}

const Template = (args) => <ViewerContainer {...args} />;

export const Primary = Template.bind({})
Primary.args = {
}