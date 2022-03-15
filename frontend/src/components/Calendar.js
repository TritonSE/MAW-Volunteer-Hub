import React, { useState, useCallback, useEffect, useRef } from "react";
import DATE_UTILS from "../date";
import AddEventModal from "./AddEventModal";
import { api_calendar_all } from "../auth";
import "../styles/Calendar.css";

// XXX: Temporary until my profile pictures PR gets merged in
const CURRENT_USER_ID = "6227c2332abac608951c8ec1";

/**
 * Component for formatting dates according
 *   to a format string.
 */
function DateFormatter({ date, fmt }) {
  const [str, setStr] = useState("");

  useEffect(() => {
    const end = DATE_UTILS.last_of_week(date);
    const full = date.getFullYear().toString();
    let tmp = "";
    fmt.split("").forEach((c) => {
      switch (c) {
        case "m": // Short month name
          tmp += DATE_UTILS.SHORT_MONTHS[date.getMonth()];
          break;
        case "M": // Full month name
          tmp += DATE_UTILS.LONG_MONTHS[date.getMonth()];
          break;
        case "W": // Short month name if week spans multiple, otherwise full
          if (end.getMonth() !== date.getMonth()) {
            tmp += `${DATE_UTILS.SHORT_MONTHS[date.getMonth()]} – ${
              DATE_UTILS.SHORT_MONTHS[end.getMonth()]
            }`;
          } else {
            tmp += DATE_UTILS.LONG_MONTHS[date.getMonth()];
          }
          break;
        case "y": // Short year (e.g. 22)
          tmp += full.substring(full.length - 2);
          break;
        case "Y": // Full year (e.g. 2022)
          tmp += date.getFullYear();
          break;
        default:
          tmp += c;
          break;
      }
    });
    setStr(tmp);
  }, [date]);

  return str;
}

/**
 * Small calendar preview panel
 */
function CalendarPreview({ setWeekStart, selected, setSelected }) {
  const [rows, setRows] = useState([]);
  const [viewMonth, setViewMonth] = useState(DATE_UTILS.first_of_month(DATE_UTILS.TODAY));

  /*
   * Generate the grid of days whenever
   *   the currently-viewed month changes
   */
  useEffect(() => {
    const tmp = DATE_UTILS.first_of_week(viewMonth);

    const out_full = [];
    let out = [];

    for (let i = 0; i < 7 * 6; i++) {
      out.push({
        date: new Date(tmp),
        subtle: tmp.getMonth() !== viewMonth.getMonth(),
      });

      if (tmp.getDay() === DATE_UTILS.SATURDAY) {
        out_full.push(out);
        out = [];
      }

      tmp.setDate(tmp.getDate() + 1);
    }
    setRows(out_full);
  }, [viewMonth]);

  /*
   * Update the view month when
   *   the user selects a new date
   */
  useEffect(() => {
    setViewMonth(DATE_UTILS.first_of_month(selected));
    setWeekStart(DATE_UTILS.first_of_week(selected));
  }, [selected]);

  return (
    <div className="calendar_preview">
      <div className="calendar_preview_head">
        <span className="calendar_preview_month">
          <DateFormatter date={viewMonth} fmt="M Y" />
        </span>
        <div>
          <button
            type="button"
            className="chevron"
            onClick={() => setViewMonth(DATE_UTILS.walk_month(viewMonth, -1))}
          >
            <img alt="Back arrow" src="/img/calendar_chevron.svg" />
          </button>
          <button
            type="button"
            className="chevron flipped"
            onClick={() => setViewMonth(DATE_UTILS.walk_month(viewMonth))}
          >
            <img alt="Forward arrow" src="/img/calendar_chevron.svg" />
          </button>
        </div>
      </div>
      <table className="calendar_preview_table" cellSpacing={0} cellPadding={0} border={0}>
        <thead>
          <tr>
            <th>S</th>
            <th>M</th>
            <th>T</th>
            <th>W</th>
            <th>T</th>
            <th>F</th>
            <th>S</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0].date}>
              {row.map((cell) => (
                <td
                  role="presentation"
                  key={cell.date.getDate()}
                  className={`
                        ${cell.subtle ? "subtle" : ""}
                        ${DATE_UTILS.compare_dates(cell.date, DATE_UTILS.TODAY) ? "today" : ""}
                        ${DATE_UTILS.compare_dates(cell.date, selected) ? "selected" : ""}
                      `}
                  height="20"
                  onClick={() => setSelected(cell.date)}
                >
                  {cell.date.getDate()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Main calendar view
 */
export default function Calendar({ isAdmin }) {
  /*
   * STATE and REFS
   */
  const [events, setEvents] = useState([]);
  const [weekStart, setWeekStart] = useState(DATE_UTILS.first_of_week(DATE_UTILS.TODAY));
  const [selected, setSelected] = useState(DATE_UTILS.TODAY);
  const [currentEvent, setCurrentEvent] = useState({ from: null, to: null, visible: false });
  const [offset, setOffset] = useState({
    x: 61, // Used to calculate an event's position on top of the table
    y: 52, // ^^^
    abs_x: 230, // Used to convert from mouse event coords to table coords
    abs_y: 160, // ^^^
  });
  const [modalOpen, setModalOpen] = useState(false);

  const scrollRef = useRef();
  const eventSizeRef = useRef({ getBoundingClientRect: () => ({ width: 53, height: 49 }) });

  const [calendars, setCalendars] = useState([
    { name: "Wish Granters", enabled: true, color: "#00BAB3", bgd: "#CCF1F0" },
    { name: "Volunteer", enabled: false, color: "#00BAB3", bgd: "#CCF1F0" },
    { name: "Mentor", enabled: false, color: "#00BAB3", bgd: "#CCF1F0" },
    { name: "Airport Greeter", enabled: true, color: "#FFB549", bgd: "#FFE589" },
    { name: "Office", enabled: false, color: "#00BAB3", bgd: "#CCF1F0" },
    { name: "Special Events", enabled: false, color: "#00BAB3", bgd: "#CCF1F0" },
    { name: "Translator", enabled: false, color: "#00BAB3", bgd: "#CCF1F0" },
    { name: "Speaker's Bureau", enabled: false, color: "#00BAB3", bgd: "#CCF1F0" },
    { name: "Las Estrellas", enabled: false, color: "#00BAB3", bgd: "#CCF1F0" },
  ]);

  /*
   * HOOKS and CALLBACKS
   */
  const compute_sizing = useCallback((node) => {
    if (!node) return;

    function resize() {
      setOffset({
        ...offset,
        abs_y: scrollRef.current ? 89 + scrollRef.current.offsetTop : 160,
      });
    }
    window.addEventListener("resize", resize);
    resize();
  }, []);

  useEffect(() => {
    setOffset({
      ...offset,
      abs_y: 89 + scrollRef.current.offsetTop,
    });
  }, [weekStart]);

  useEffect(async () => {
    scrollRef.current.scrollTo(0, 386);

    const res = await api_calendar_all();
    if (res && !res.error)
      setEvents(
        res.map((evt) => ({
          ...evt,
          calendar: calendars.find((cal) => cal.name === evt.calendar) || calendars[0],
          date: {
            from: new Date(evt.from),
            to: new Date(evt.to),
          },
          confirmed: evt.volunteers.indexOf(CURRENT_USER_ID) > -1,
        }))
      );
  }, []);

  /*
   * STYLE and FORMATTING
   */
  function date_from_pos(x, y) {
    const xadj = x - offset.x - offset.abs_x;
    const xmod = Math.floor(xadj / eventSizeRef.current.getBoundingClientRect().width);

    const yadj = y - offset.y - offset.abs_y + (scrollRef.current.scrollTop || 0);
    const ymod = Math.floor(yadj / eventSizeRef.current.getBoundingClientRect().height);

    const ymin_orig =
      ((yadj % eventSizeRef.current.getBoundingClientRect().height) /
        eventSizeRef.current.getBoundingClientRect().height) *
      60;
    const ymin = Math.floor(ymin_orig / 15) * 15;

    if (xadj < 0 || yadj < 0) return null;

    const out = DATE_UTILS.walk_day(weekStart, xmod);
    out.setHours(ymod, ymin, 0);

    return out;
  }
  function pos_from_date(date) {
    return {
      x: date.getDay() * eventSizeRef.current.getBoundingClientRect().width + offset.x,
      y:
        date.getHours() * eventSizeRef.current.getBoundingClientRect().height +
        (date.getMinutes() / 60) * eventSizeRef.current.getBoundingClientRect().height +
        offset.y,
    };
  }

  function styles_from_event(event, is_selected) {
    const { date, confirmed, calendar } = event;
    const from = date.from;
    const to = date.to;

    if (!from || !to) return {};
    if (
      !DATE_UTILS.is_within_week(weekStart, from) ||
      (!(calendar ?? {}).enabled && !is_selected)
    ) {
      return {
        display: "none",
      };
    }

    const pos = pos_from_date(from);
    const dif = DATE_UTILS.difference(to, from);
    if (dif === 0) return {};

    const cal = calendar ?? calendars[0];

    const out = {
      top: `${pos.y}px`,
      height: `${Math.floor(
        (dif / DATE_UTILS.HOUR_IN_MS) * eventSizeRef.current.getBoundingClientRect().height
      )}px`,
      background: confirmed || isAdmin ? cal.bgd : "#ffffff",
      color: cal.color,
      borderColor: confirmed || isAdmin ? "#ffffff" : cal.color,
    };

    if (!is_selected) {
      // Compute overlapping elements to determine element width
      //   (Logic mostly copied from observations about Google Calendar,
      //   with a few tweaks)
      const overlaps = [];
      let x = pos.x;
      let w = 0.95 * eventSizeRef.current.getBoundingClientRect().width;
      events.forEach((evt) => {
        if (evt.calendar.enabled && DATE_UTILS.dates_overlap(evt.date, { from, to })) {
          overlaps.push(evt);
        }
      });

      if (overlaps.length > 0) {
        let last = null;
        overlaps.sort((a, b) => a.date.from - b.date.from);
        overlaps.every((evt, ind) => {
          if (last) {
            if (
              Math.abs(DATE_UTILS.difference(last.date.from, evt.date.from)) <=
              DATE_UTILS.HOUR_IN_MS / 2
            ) {
              w /= 2;
              x += w;
            } else {
              w -= 5;
              x += 5;
            }
          }
          last = evt;

          if (evt === event) {
            out.zIndex = ind;
            return false;
          }
          return true;
        });
      }

      out.left = `${x}px`;
      out.width = `${w}px`;
    } else {
      out.left = `${pos.x}px`;
      out.width = `${eventSizeRef.current.getBoundingClientRect().width}px`;
      out.zIndex = 999;
    }

    return out;
  }

  /*
   * EVENTS
   */
  function mouse_down(e) {
    if (e.target.tagName === "TH" || e.target.className.indexOf("time") > -1) return;

    const from = date_from_pos(e.pageX, e.pageY);
    if (!from) return;
    setCurrentEvent({
      from,
      visible: false,
    });
  }
  function mouse_move(e) {
    if (!currentEvent.from) return;

    const to = date_from_pos(e.pageX, e.pageY);
    if (!to) return;

    if (to > currentEvent.from) {
      setCurrentEvent({
        from: currentEvent.from,
        to,
        visible: true,
      });
    } else if (to < currentEvent.from) {
      setCurrentEvent({
        from: to,
        to: currentEvent.from,
        visible: true,
      });
    } else {
      setCurrentEvent({
        from: currentEvent.from,
        to,
        visible: false,
      });
    }
  }
  function mouse_up(e) {
    if (!currentEvent.from) return;

    const tmp = {
      from: currentEvent.from,
      to: date_from_pos(e.pageX, e.pageY),
    };
    if (!tmp.to) return;

    if (!tmp.to || DATE_UTILS.compare_times(tmp.from, tmp.to)) {
      tmp.to = DATE_UTILS.walk_hour(currentEvent.from);
    }

    setCurrentEvent({
      ...tmp,
      visible: true,
    });
    setModalOpen(true);
  }

  function toggle_calendar(cal, state) {
    const cpy = calendars.slice();
    cpy[cpy.indexOf(cal)].enabled = state;
    setCalendars(cpy);
  }

  function add_event({ event }) {
    const cpy = events.slice();
    cpy.push({
      ...event,
      calendar: calendars.find((cal) => cal.name === event.calendar) || calendars[0],
      date: {
        from: new Date(event.from),
        to: new Date(event.to),
      },
    });

    setEvents(cpy);
    setCurrentEvent({ from: null, to: null, visible: false });
    setModalOpen(false);
  }

  function view_event(event) {
    console.log(event);
  }

  /*
   * RENDER
   */
  return (
    <div className="calendar_scrollfix">
      <div className="calendar_view">
        <div className="calendar_side">
          <button type="button" className="calendar_add" onClick={() => setModalOpen(true)}>
            <img src="/img/calendar_add.svg" alt="Add event" />
            <div>New Event</div>
          </button>
          <CalendarPreview
            setWeekStart={setWeekStart}
            selected={selected}
            setSelected={setSelected}
          />
          <div className="calendar_selection">
            <div className="calendar_selection_header">View calendars</div>
            {calendars.map((cal) => (
              <label key={cal.name} className="calendar_selection_cal" htmlFor={cal.name}>
                <div>
                  <input
                    type="checkbox"
                    id={cal.name}
                    checked={cal.enabled}
                    onChange={(e) => toggle_calendar(cal, e.target.checked)}
                  />
                  <div className="calendar_checkbox" style={{ "--checked-color": cal.color }} />
                </div>
                <div>{cal.name}</div>
              </label>
            ))}
          </div>
        </div>
        <div className="calendar_box">
          <div className="calendar_head">
            <button
              type="button"
              className="chevron today"
              onClick={() => {
                setWeekStart(DATE_UTILS.first_of_week(DATE_UTILS.TODAY));
                setSelected(DATE_UTILS.TODAY);
              }}
            >
              Today
            </button>
            <button
              type="button"
              className="chevron"
              onClick={() => {
                setWeekStart(DATE_UTILS.walk_day(weekStart, -7));
                setSelected(DATE_UTILS.walk_day(selected, -7));
              }}
            >
              <img alt="Back arrow" src="/img/calendar_chevron.svg" />
            </button>
            <h1>
              <DateFormatter date={weekStart} fmt="W Y" />
            </h1>
            <button
              type="button"
              className="chevron flipped"
              onClick={() => {
                setWeekStart(DATE_UTILS.walk_day(weekStart, 7));
                setSelected(DATE_UTILS.walk_day(selected, 7));
              }}
            >
              <img alt="Forward arrow" src="/img/calendar_chevron.svg" />
            </button>
            <div className="counterweight" />
          </div>

          <div ref={scrollRef} className="calendar_scrollbox">
            <table
              role="presentation"
              className="calendar"
              cellPadding={0}
              cellSpacing={0}
              border={0}
              onMouseDown={mouse_down}
              onMouseMove={mouse_move}
              onMouseUp={mouse_up}
            >
              <thead>
                <tr>
                  <th width="61">&nbsp;</th>
                  {DATE_UTILS.DAYS_OF_WEEK.map((day, ind) => {
                    const tmp = DATE_UTILS.walk_day(weekStart, ind);
                    return (
                      <th
                        key={day}
                        className={DATE_UTILS.compare_dates(DATE_UTILS.TODAY, tmp) ? "today" : ""}
                      >
                        <div>{day}</div>
                        <div>{tmp.getDate()}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {[...Array(24).keys()].map((i) => (
                  <tr key={i}>
                    <td width="61" className="time">
                      {i > 0 ? DATE_UTILS.format_hour(i) : ""}
                    </td>
                    <td ref={i === 0 ? compute_sizing : null} />
                    <td ref={i === 0 ? eventSizeRef : null} />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                  </tr>
                ))}
              </tbody>
            </table>
            <br />

            {events.map((evt) => (
              <div
                key={evt._id}
                role="presentation"
                className={`calendar_event ${evt.confirmed ? "confirmed" : ""}`}
                style={styles_from_event(evt, false, evt.calendar)}
                onMouseDown={mouse_down}
                onMouseMove={mouse_move}
                onMouseUp={(e) => {
                  if (currentEvent.visible) {
                    mouse_up(e);
                  } else {
                    view_event(evt);
                  }
                }}
              >
                <div className="calendar_event_time">
                  {DATE_UTILS.format_range(evt.date.from, evt.date.to, true)}
                </div>
                <div className="calendar_event_title">{evt.name}</div>
              </div>
            ))}
            {currentEvent.visible ? (
              <div
                role="presentation"
                className="calendar_event current"
                style={styles_from_event({ date: currentEvent, confirmed: false }, true)}
                onMouseDown={mouse_down}
                onMouseMove={mouse_move}
                onMouseUp={mouse_up}
              >
                <div className="calendar_event_time">
                  {DATE_UTILS.format_range(currentEvent.from, currentEvent.to, true)}
                </div>
                <div className="calendar_event_title">(No title)</div>
              </div>
            ) : null}

            <div
              className="calendar_ticker"
              style={{
                display: DATE_UTILS.is_within_week(weekStart, DATE_UTILS.TODAY) ? "block" : "none",
                top: `${pos_from_date(new Date()).y}px`,
                left: `${pos_from_date(new Date()).x}px`,
                width: `${eventSizeRef.current.getBoundingClientRect().width}px`,
              }}
            >
              <div className="calendar_ticker_ball" />
              <div className="calendar_ticker_line" />
            </div>
          </div>
        </div>

        <AddEventModal
          currentEvent={currentEvent}
          setCurrentEvent={setCurrentEvent}
          isOpen={modalOpen}
          setIsOpen={setModalOpen}
          calendars={calendars}
          addEvent={(args) => add_event(args)}
        />
        {/* TODO: Enable/disable calendar, clear current event on request close */}
      </div>

      {/* Hints to help with cursor positioning/offset calculation */}
      {/*
      <div
        style={{
          position: "absolute",
          width: "10px",
          height: "10px",
          background: "purple",
          left: `${offset.abs_x}px`,
          top: `${offset.abs_y}px`,
          zIndex: "99999"
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "10px",
          height: "10px",
          background: "red",
          left: `${offset.abs_x + offset.x}px`,
          top: `${offset.abs_y + offset.y}px`,
          zIndex: "99999"
        }}
      /> */}
    </div>
  );
}
