import React from "react";
import styles from "./OrderExistAlertModal.module.css";
import { Modal, Row, Col } from "react-bootstrap";
import { useUpdateOrderAndCreateKOTMutation } from "../Utils/customMutationHooks";


function OrderExistAlertModal({ show, hide, finalOrder ,printers}) {


      const {mutate,isLoading} = useUpdateOrderAndCreateKOTMutation(printers,hide,finalOrder)

      // const handleConfirm = async (finalOrder) => {
      //       let { data } = await axios.post(`http://${IPAddress}:3001/updateOrderAndCreateKOT`, finalOrder);
      //       return data;
      // };

      // const { mutate, isLoading } = useMutation({      
      //       mutationKey: "updateOrderAndCreateKOT",
      //       mutationFn: handleConfirm,
      //       onSuccess:  (data) => {
      //             console.log(data)
      //             hide();
      //             executeKotPrint({...finalOrder,kotTokenNo:data}, printers);
      //             dispatch(resetFinalOrder());
      //             notify("success", "Orders and KOT updated");
      //       },
      // });

      return (
            <Modal show={show} onHide={hide} backdrop="static" centered animation={false}>
                  <Modal.Body className={styles.modalBody}>
                        <Row>
                              <Col className={styles.message}>Dine In order for same table number is currently active do you want to merger the KOT with active order</Col>
                        </Row>
                        <Row>
                              <Col className={styles.modalControl}>
                                    <button className={styles.okBtn} onClick={() => mutate(finalOrder)} disabled={isLoading}>
                                          {isLoading ? "Loading" : "OK"}
                                    </button>
                                    
                                    <button className={styles.cancelBtn} onClick={hide}>
                                          Cancel
                                    </button>
                              </Col>
                        </Row>
                  </Modal.Body>
            </Modal>
      );
}

export default OrderExistAlertModal;
