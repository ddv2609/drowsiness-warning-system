import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDribbble, faFacebook, faPinterest, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faHome, faMailBulk, faPhone } from "@fortawesome/free-solid-svg-icons";

import styles from "./Footer.module.css";
import SocialNetwork from "./SocialNetwork";
import ContactInfo from "./ContactInfo";
import clsx from "clsx";
import { Col, Divider, Row } from "antd";

function Footer() {
  const socialNetworks = [
    {
      name: "facebook",
      href: "https://www.facebook.com/",
      icon: faTwitter,
      desc: "Like us on Facebook"
    },
    {
      name: "twitter",
      href: "https://twitter.com/",
      icon: faFacebook,
      desc: "Follow us on Twitter"
    },
    {
      name: "dribbble",
      href: "https://dribbble.com/",
      icon: faDribbble,
      desc: "Follow us on Dribbble"
    },
    {
      name: "pinterest",
      href: "https://www.pinterest.com/",
      icon: faPinterest,
      desc: "Follow us on Pinterest"
    }
  ]

  const contactInfos = [
    {
      name: "phone",
      href: "tel:0919904032",
      content: "0919904032",
      icon: faPhone
    },
    {
      name: "email",
      href: "mailto:doducvien26092002@gmail.com",
      content: "doducvien26092002-@gmail.com",
      icon: faMailBulk
    }
  ]

  return (
    <footer className={styles.footer}>
      <div className={clsx([styles.wrapContent, "container"])}>
        <div className={styles.moreInfo}>
          <Row align="top" justify="center">
            <Col md={24} lg={10} xl={10}>
              <div className={styles.about}>
                <h3 className={styles.headingThird}>More About Website</h3>
                <p className={styles.paragraph}>Welcome to our drowsy driving alert system website. We are committed to helping you stay safe on the road by preventing drowsy driving accidents.Drowsy driving is a serious safety hazard, causing millions of accidents and injuries each year. Our system uses advanced technology to detect signs of drowsiness. When our system detects drowsiness, it will sound an alarm and voice to wake you up. We hope you will visit our website to learn more about our system and how it can help you stay safe on the road.</p>
              </div>
            <Divider className={styles.separateAbout}></Divider>
            </Col>
            <Col md={12} lg={7} xl={8}>
              <div className={styles.keepConnect}>
                <div>
                  <h3 className={styles.headingThird}>Keep Connected</h3>
                </div>
                <div className={styles.wrapConnect}>
                  <ul className={styles.unorderList}>
                    {socialNetworks.map((socialNetwork, index) => (
                      <SocialNetwork key={index} connected={socialNetwork} />
                    ))}
                  </ul>
                </div>
              </div>
            <Divider className={styles.separateConnect}></Divider>
            </Col>
            <Col md={12} lg={7} xl={6}>
              <div className={styles.contact}>
                <div>
                  <h3 className={styles.headingThird}>Contact Info</h3>
                </div>
                <div>
                  <div className={styles.home}>
                    <div className={styles.icon}>
                      <FontAwesomeIcon icon={faHome} />
                    </div>
                    <div className={styles.description}>
                      <p className={styles.desPara}>The company name
                        Lorem ipsum dolor,
                        Glasglow Dr 40 Fe 72.</p>
                    </div>
                  </div>
                  {contactInfos.map((contact, index) => (
                    <ContactInfo key={index} contact={contact} />
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div>
          <p className={styles.copyrightParagraph}>CopyRight © 2023 By Do Vien</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;