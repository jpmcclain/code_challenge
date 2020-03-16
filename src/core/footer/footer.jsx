import React from 'react';
import './footer.less';
import { environment }from '../../environments/environments';

/*const MyComponents = {
    DatePicker: function DatePicker(props) {
        return <div>Imagine a {props.color} datepicker here.</div>;
    }
}*/
function Footer() {
    let currentYear: number;
    let date = new Date();
    currentYear = date.getFullYear();
    let version = environment.version;
    return (
        <footer>
            <div>
                <span className="d-none d-md-inline">Template v{version}</span>
                <span className="float-md-right">IMS {currentYear}. </span>
            </div>
        </footer>
    );
}

export default Footer;
