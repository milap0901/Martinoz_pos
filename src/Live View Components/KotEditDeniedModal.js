import React from 'react'
import styles from './KotEditDeniedModal.module.css'
import { Col, Modal, Row } from 'react-bootstrap'

function KotEditDeniedModal({hide,show,message}) {
  return (
    <Modal show={show} className={styles.mainModal} onHide={hide} backdrop="static" centered animation={false}>
                  <Modal.Body className={styles.modalBody}>
                        <Row>
                              <Col className={styles.message}>{message}</Col>
                        </Row>
                        <Row>
                              <Col className={styles.modalControl}>
                                    <button className={styles.okBtn} onClick={hide} >
                                        Ok
                                    </button>
                              </Col>
                        </Row>
                  </Modal.Body>
            </Modal>
  )
}

export default KotEditDeniedModal