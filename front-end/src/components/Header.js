import React, { useContext, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaintBrush, faHome } from '@fortawesome/free-solid-svg-icons';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Container from "react-bootstrap/Container";
import Image from 'react-bootstrap/Image';
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/navbar.scss";
import { DataContext } from "../context/dataContext";
import axios from "axios";
import { useNavigate } from "react-router";

export default function Header({cart, setCart, expanded, setExpanded}) {
  const dataState = useContext(DataContext);
  const [searchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search'));
  const navigate = useNavigate();

  useEffect(() => {
    axios.post("/order/api/cart", { userID: dataState.user.id})
      .then((all) => {
        setCart(all.data)
      })
  },[setCart, dataState.user.id])

  const theme = createTheme({
    palette: {
      primary: {
        main: '#595443',
      },
      secondary: {
        main: '#8C3503', 
      },
    },
  });
  
  const handleLogout = () => {
    dataState.setUser({})
    axios.get('/logout')
  };
  
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if(searchInput) {
     navigate(`/results?search=${searchInput}`) 
     setSearchInput("");
   }
  };

  const handleSearchInput = (e) => {
    const data = e.target.value
    setSearchInput(data)
  };
  
  return (
    <Navbar className="navbar" expand="lg" expanded={expanded} >
      <Container fluid>
        <div className="brand">
        <Navbar.Brand>
          <FontAwesomeIcon className="nav-icon" icon={faPaintBrush} />
          <Link className="text-decoration-none text-black" to="/">
            Artify
          </Link>
        </Navbar.Brand>          
        </div>
        <Navbar.Toggle className="toggle-btn" aria-controls="navbarScroll" onClick={() => setExpanded(expanded ? false : "expanded")}/>
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" >

            <Nav.Link
              as={Link}
              className="text-decoration-none text-black"
              to="/"
            >
              <FontAwesomeIcon icon={faHome} />
            </Nav.Link>

            <Nav.Link
              as={Link}
              className="text-decoration-none text-black"
              to="/categories"
            >
              Categories
            </Nav.Link>

            <Nav.Link
              as={Link}
              id="artist-nav-link"
              className="text-decoration-none text-black"
              to="/artists"
            >
              Artists
            </Nav.Link>

          </Nav>
    
          <Nav>
            {dataState.user.id &&         
            < Nav.Link
              as={Link}
              to="/cart"
            >
              <ThemeProvider theme={theme}>
                <Badge badgeContent={cart.length && cart.length} color="secondary">
                  <ShoppingCartIcon color="action" />
                </Badge>                  
              </ThemeProvider>

            </Nav.Link> 
            }

            {!dataState.user.id && <Nav.Link
              as={Link}
              className="text-decoration-none text-black"
              to="/login"
            >
              Login
            </Nav.Link>}

            {!dataState.user.id && <Nav.Link
              as={Link}
              className="text-decoration-none text-black"
              to="/register"
            >
              Register
            </Nav.Link>}

            {dataState.user.id &&
            <Nav.Link
              as={Link}
              id="user-profile-link"
              className="text-decoration-none text-black"
              to={"/profile/" + dataState.user.id}
            >
              <Image src={dataState.user.avatar_image} alt={dataState.user.first_name + dataState.user.last_name} className="header-avatar-img" roundedCircle="true" /> Profile
            </Nav.Link>
            }

            {dataState.user.id && 
            <Nav.Link
              as={Link}
              id="logout-button"
              className="text-decoration-none text-black"
              to="/login"
              onClick={handleLogout}
            >
              Logout
            </Nav.Link>}

          </Nav>

          <form onSubmit={(e) => handleSubmit(e)} className="d-flex">
            <input onChange={(e) => handleSearchInput(e) } value={searchInput || ''} name="name" placeholder="Search" type="text"  id="form3Example4" className="form-control"/>
            <button className='button' type="submit" >Search</button>
          </form>
           
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
