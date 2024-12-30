import React from 'react';

function Footer() {
  return (
    <footer className="footer pt-4" style={{backgroundColor: "#001524", color: "#ffffff"}}>
      <div className="container">
        <div className="row">
          <div className="col-6 col-sm-3 col-lg-2 mb-4">
            <h6><b>Help</b></h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>FAQ</a></li>
              <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Privacy policy</a></li>
              <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Cookies privacy</a></li>
              <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Terms of use</a></li>
              <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Help centre</a></li>
            </ul>
          </div>
          <div className="col-6 col-sm-3 col-lg-2 mb-4">
            <h6><b>Get the App</b></h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>IOS app</a></li>
              <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Android app</a></li>
            </ul>
          </div>
          <div className="col-6 col-sm-3 col-lg-2 mb-4">
            <h6><b>Company</b></h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>About Us</a></li>
              <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Blog</a></li>
              <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Careers</a></li>
              <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>PointMAX</a></li>
            </ul>
          </div>
          <div className="col-6 col-sm-3 col-lg-2 mb-4">
            <h6><b>Destination</b></h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Cities</a></li>
              <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Spiritual places</a></li>
              <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Hill Stations</a></li>
              <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Solo Travel places</a></li>
            </ul>
          </div>
          <div className="col-12 col-lg-4 mb-4">
            <h6 className="d-flex justify-content-center"><b>Social Networks</b></h6>
            <ul className="list-unstyled d-flex justify-content-center p-2">
              <li className="me-2"><a href="#"><img src="/assets/img/footer social meadia icons/Frame 406.png" alt="Facebook" className="rounded-pill" /></a></li>
              <li className="me-2"><a href="#"><img src="/assets/img/footer social meadia icons/Frame 407.png" alt="Twitter" className="rounded-pill" /></a></li>
              <li className="me-2"><a href="#"><img src="/assets/img/footer social meadia icons/Frame 408.png" alt="Instagram" className="rounded-pill" /></a></li>
              <li className="me-2"><a href="#"><img src="/assets/img/footer social meadia icons/Frame 410.png" alt="LinkedIn" className="rounded-pill" /></a></li>
              <li className="me-2"><a href="#"><img src="/assets/img/footer social meadia icons/Frame 409.png" alt="YouTube" className="rounded-pill" /></a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="horizontal-line bg-white my-3" style={{height: "1px"}}></div>
      <h6 className="text-center mx-5 pt-3">&copy; 2023 Y.SPOT Rooms pvt .ltd.</h6>
    </footer>
  );
}

export default Footer;

