import React from 'react';
import {Navbar, Nav} from 'react-bootstrap';
import './header.less';

class Header extends React.Component {
    render() {
        return(
            <Navbar collapseOnSelect expand="lg" variant="light">
                <Navbar.Brand href="/Home">Inventory Management System</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/Home">Dashboard</Nav.Link>
                        <Nav.Link href="/Inventory">Inventory</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    };
}

export default Header;
