import * as React from 'react'

type TwitterTimelineProps = {}
let isLoadwidgets = false;

export const TwitterTimeLine: React.FC<TwitterTimelineProps> = (_props) => {
    React.useEffect(() => {
        if (!isLoadwidgets) {
            const s = document.createElement("script");
            s.setAttribute("src", "https://platform.twitter.com/widgets.js");
            document.body.appendChild(s);
            isLoadwidgets = true;
        }
    }, [])
    return (
        <>
            <a className="twitter-timeline" data-height="600" href="https://twitter.com/FumipoT?ref_src=twsrc%5Etfw">Tweets by FumipoT</a>
        </>
    )
}