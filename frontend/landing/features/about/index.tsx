/* eslint-disable @typescript-eslint/no-var-requires */
import { Button, Field, Typography } from '@smar/ui';

import { Header } from 'features/layout/header';

import st from './styles.module.scss';

const clouds = require('./assets/clouds-1.jpg?min=768&max=1920&steps=7');
const clouds2 = require('./assets/clouds-2.jpg?min=768&max=1920&steps=7');

export const AboutPage = () => {
  return (
    <>
      <Header variant="static" />
      <div className={st.tumb}>
        <div className="container">
          <div className={st.aboutBlock}>
            <div className={st.label}>about us</div>
            <h3 className={st.title}>SFere – Global SF Community</h3>
            <p className={st.description}>
              Founded by Imperial College Metal Forming Group, and working out of the world's top
              universities, our dedicated research group of mechanical engineers and material
              scientists has a unified passion of advancing metal forming technologies. With our
              rich experience in metals forming. We aim to deliver breakthroughs and theories that
              offer cutting edge knowledge on warm and hot forming of metal, as well as enhance the
              capability of finite element (FE) simulations.
            </p>
          </div>
          <img
            alt=""
            className={st.clouds}
            loading="lazy"
            role="presentation"
            src={clouds.src}
            srcSet={clouds.srcSet}
          />
        </div>
      </div>
      <div className={st.expertiseBlock}>
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className={st.label}>Why SF</div>
            <h3 className={st.title}>Expertise</h3>
          </div>
          <div style={{ display: 'flex' }}>
            <p className={st.description} style={{ paddingRight: '16px' }}>
              The key research of our team is related to development of unified costitutive
              equations predict microstructure evolutions in thermomechanical forming processes.
              Multiscale material modelling is also carried out for the purpose of understanding
              fundamental aspects of material deformation. New equations informed by discrete
              modelling are continuously being introduced for mechanism such as grain boundary
              siding and rotation, and the interaction between dislocations and grain boundaries.
            </p>
            <p className={st.description} style={{ paddingLeft: '16px' }}>
              Most recently, we have developed these models into novel functional modules that work
              seamlessly with FE simulations for multi-objective purposes and that can be operated
              remotely, and will continue to do so into the future. We share expertise by offering
              users the opportunity to customize their production line to work with an optimal
              processing window, as well as accurately predict the occurence of failure and estimae
              tool life, among many other capabilities.
            </p>
          </div>
        </div>
      </div>
      <div className={st.visionBlock}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className={st.visionTextWrap}>
            <div className={st.label}>THE goals</div>
            <h3 className={st.title}>Vision</h3>
            <p className={st.description}>
              Our mission is to provide solution and develop further applications of metal forming
              through unindustrial collaborations, drawing on knowledge and experience from as many
              available resourses as possible. We want to reach out to worldwide research
              institution and industrial partners to establish a collaborative network, and
              accelerate the widespread adoption of metal forming.
            </p>
          </div>
          <div className={st.subscribeBlock}>
            <div className={st.subscribeBlockText}>
              <Typography as="h4" variant="h300">
                Subscribe to our newsletter
              </Typography>
              <p>Stay updated about the latest news and our products</p>
            </div>
            <div className={st.subscribeBlockField}>
              <form action="">
                <Field type="email" name="email" placeholder="Enter your email here" />
                <Button style={{ flexShrink: 0, minHeight: '48px', marginLeft: '16px' }}>
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
        <img
          alt=""
          className={st.visionClouds}
          loading="lazy"
          role="presentation"
          src={clouds2.src}
          srcSet={clouds2.srcSet}
        />
      </div>
    </>
  );
};
