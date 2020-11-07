class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            appVersion: ''
        }
    }

    render() {
        return(
           <div class="container">
               <div class="row">

                    <div class="col-md-4 col-sm-6">
                         <div class="footer-info">
                              <div class="section-title">
                                   <h2>Office Address</h2>
                              </div>
                              <address>
                                   <p>0000 World St,<br></br> Tempe, AZ 00000</p>
                              </address>

                              <ul class="social-icon">
                                   <li><a href="#" class="fa fa-facebook-square" attr="facebook icon"></a></li>
                                   <li><a href="#" class="fa fa-twitter"></a></li>
                                   <li><a href="#" class="fa fa-instagram"></a></li>
                              </ul>

                              <div class="copyright-text"> 
                                   <p>Copyright &copy; 2020 Covidly-Safe</p>
                                   
                                   <p>Design: TemplateMo</p>
                              </div>
                         </div>
                    </div>

                    <div class="col-md-4 col-sm-6">
                         <div class="footer-info">
                              <div class="section-title">
                                   <h2>Contact Us</h2>
                              </div>
                              <address>
                                   <p>+1 (000) 000 0000</p>
                                   <p><a href="mailto:youremail.co">covidly-safe@asu.edu</a></p>
                              </address>

                              <div class="footer_menu">
                                   <h2>Quick Links</h2>
                                   <ul>
                                        <li><a href="about.html">About Us</a></li>
                                        <li><a href="#">Sellers</a></li>
                                        <li><a href="#">Terms & Conditions</a></li>
                                        <li><a href="#">Refund Policy</a></li>
                                   </ul>
                              </div>
                         </div>
                    </div>

                    
                    <div class="col-md-4 col-sm-12">
                         <div class="footer-info newsletter-form">
                                 <div class="section-title">
                                     <h2>Covidly-Safe Promotion Signup</h2>
                                 </div>
                                 <div>
                                     <div class="form-group">
                                         <form action="#" method="get">
                                             <input type="email" class="form-control" placeholder="Enter your email" name="email" id="email" required=""></input>
                                             <input type="submit" class="form-control" name="submit" id="form-submit" value="Send me"></input>
                                         </form>
                                         <span><sup>*</sup> By clicking "Send me" you allow us to have your information.</span>
                                     </div>
                                 </div>
                         </div>
                     </div>
               </div>
          </div>
        )
    }
} 

ReactDOM.render(<Footer/>, document.querySelector('.footer'));