import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import dayjs from 'dayjs';

const localizer = dayjsLocalizer(dayjs);

const MyCalendar = ({ myEventsList, style }) => (
  <div>
    <Calendar
      localizer={localizer}
      events={myEventsList || []}
      startAccessor="start"
      endAccessor="end"
      style={style || { height: '80vh' }}
      timeslots={6}
      defaultView='week'
    />
  </div>
);

export default MyCalendar;
