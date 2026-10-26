import { Overlay } from './Modal.jsx';

/** Side panel. `modal={false}` leaves the page usable behind it (used by Demo tools). */
export default function Drawer({ modal = true, ...props }) {
  return <Overlay variant="drawer" modal={modal} {...props} />;
}
