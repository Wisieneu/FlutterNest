import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBomb, faBug, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

import './index.scss';
import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="error-container fullscreen">
      <a className="back-btn" href="/">
        {'>> '}Back to main page
      </a>
      <div className="error-msg">
        <p className="icons">
          <FontAwesomeIcon icon={faBomb} size="2x" />
          <FontAwesomeIcon icon={faTriangleExclamation} size="2x" />
          <FontAwesomeIcon icon={faBug} size="2x" />
        </p>
        <p className="error-header">Something went wrong</p>
        <p className="error-header">Check the browser console for details</p>
        <p>
          If you believe this issue should be addressed,{' '}
          <a
            href="https://github.com/Wisieneu/FlutterNest/issues"
            className="repo-link"
            target="_blank"
          >
            submit a ticket
          </a>
        </p>
      </div>
    </div>
  );
}
