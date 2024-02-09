import { faGithubSquare, faTwitterSquare } from "@fortawesome/free-brands-svg-icons";
import { faCopyright } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Foot(){
  return(
    <footer>
        <div>
          <a
          href="https://creativecommons.org/publicdomain/zero/1.0/"
          target="_blank"
          rel="noopener noreferrer"> <FontAwesomeIcon
            icon={faCopyright}
            className="fa  fa-copyright fa-flip-horizontal"
            /> CC0
          </a> - 2018-2024 - Department of Decentralization
        </div>
        <div>
          <a
          href="https://github.com/department-of-decentralization"
          target="_blank"
          rel="noopener noreferrer"> <FontAwesomeIcon
            icon={faGithubSquare}
            className="fa-brands fa-github-square"
            /> department-of-decentralization
          </a> <a
          href="https://twitter.com/dod_berlin"
          target="_blank"
          rel="noopener noreferrer"> <FontAwesomeIcon
            icon={faTwitterSquare}
            className="fa-brands fa-twitter-square"/> dod_berlin
          </a>
        </div>
    </footer>
  )
}
