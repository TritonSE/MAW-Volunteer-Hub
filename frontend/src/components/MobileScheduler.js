import React, { useState, useEffect, useRef } from "react";
import {
  DateFormatter,
  DateRangeFormatter,
  dateFunctions,
} from "@cubedoodl/react-simple-scheduler";
import "../styles/MobileScheduler.css";

export default function MobileScheduler({ events, onRequestEdit }) {
  const [height, setHeight] = useState(-1);
  const scrollRef = useRef();

  const sorted = events.sort((a, b) => a.from - b.from);
  let last = new Date(0);

  useEffect(() => {
    if (height > -1) scrollRef.current.scrollTo(0, height);
  }, [height]);

  return (
    <div className="mobile_scheduler" ref={scrollRef}>
      {sorted.map((evt, ind) => {
        const show_date = !dateFunctions.compare_dates(last, evt.from);
        const show_month = last.getMonth() !== evt.from.getMonth();
        const show_ticker = last < dateFunctions.TODAY && evt.from >= dateFunctions.TODAY;
        last = evt.from;

        if (show_ticker && height === -1) setHeight((ind + 2) * 53);

        return (
          <span key={evt._id}>
            {show_date && ind > 0 && <br />}
            {show_month && (
              <div className="month">
                <div className="line" />
                <span className="format">
                  <DateFormatter date={evt.from} fmt="O Y" />
                </span>
                <div className="line" />
              </div>
            )}
            {show_ticker && (
              <div className="ticker">
                <div className="ball" />
                <div className="line" />
              </div>
            )}
            <div className="event">
              <div className="date">
                {show_date && (
                  <>
                    <div className="number">
                      <DateFormatter date={evt.from} fmt="d" />
                    </div>
                    <DateFormatter date={evt.from} fmt="x" />
                  </>
                )}
              </div>
              <button
                type="button"
                className="box"
                style={evt.style}
                onClick={() => onRequestEdit(evt)}
              >
                <div>
                  <div className="range">
                    <DateRangeFormatter from={evt.from} to={evt.to} />
                  </div>
                  <div className="name">{evt.name}</div>
                </div>
              </button>
            </div>
          </span>
        );
      })}
    </div>
  );
}
