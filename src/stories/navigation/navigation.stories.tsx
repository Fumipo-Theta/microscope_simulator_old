import * as React from "react";
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { RecoilRoot } from "recoil";

import { Navigation } from "@src/js/component/navigation/navigation";

export default {
    title: 'SCOPin/Navigation',
    component: Navigation,
    decorators: [
        (Story) => <RecoilRoot>{Story()}</RecoilRoot>
    ],
} as ComponentMeta<typeof Navigation>;

const Template: ComponentStory<typeof Navigation> = (args) => <Navigation {...args} />;

export const Primary = Template.bind({})
Primary.args = {
}
