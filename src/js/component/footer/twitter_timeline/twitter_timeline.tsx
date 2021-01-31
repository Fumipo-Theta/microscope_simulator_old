import * as React from 'react'

type TwitterTimelineProps = {}

export const TwitterTimeLine: React.FC<TwitterTimelineProps> = (_props) => {
    return (
        <>
            <a className="twitter-timeline" data-height="600" href="https://twitter.com/FumipoT?ref_src=twsrc%5Etfw">Tweets by FumipoT</a>
            <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
        </>
    )
}