import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { ProjectName } from "@/common/constants";
import { Coffee } from "@/features/ui/coffee";

interface SupportDeveloperModalProps {
  show: boolean;
  handleClose: {
    (): void;
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  };
}

export function SupportDeveloperModal(props: SupportDeveloperModalProps) {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Support the Developer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>A bit about me</h4>
        <p>
          Hey there! Thanks for checking out {ProjectName}. I&apos;m Nick, the
          creator and primary developer of this project.
        </p>
        <p>
          I&apos;m responsible for this website, the code that image repository
          servers run on, and the desktop tool that automates
          MakePlayingCards.com.
        </p>
        <p>
          I started developing {ProjectName} in early 2020 while I was in uni to
          simplify how the tabletop gaming community shares its MPC print-ready
          images &mdash; at the time, we were manually browsing through Google
          Drives to find cards we wanted to print and dragging & dropping them
          into MPC.
        </p>
        <p>
          These days, I&apos;m working full-time and continuing to develop{" "}
          {ProjectName} by night, and I&apos;m passionate about delivering the
          best print tooling I can to the tabletop gaming community.
        </p>
        <p>
          {ProjectName} is completely open source software (licensed under
          GPL-3) and all of its features will always be free.
        </p>
        <p>
          You can support my continued development of this project through{" "}
          <i>Buy Me a Coffee</i> below ♥️
        </p>
        <h4>Where does my donation go?</h4>
        <p>
          I don&apos;t host any {ProjectName} servers, just the website
          you&apos;re on right now &mdash; which GitHub allows me to host for
          free.
        </p>
        <p>Any donation goes towards:</p>
        <ul>
          <li>Fuelling my coffee addiction, and</li>
          <li>
            Allowing me to spend more time developing and improving this project
            for you all. Several large features are in the pipeline that
            I&apos;m excited to share when they&apos;re ready!
          </li>
        </ul>
        <hr />
        <Coffee />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
