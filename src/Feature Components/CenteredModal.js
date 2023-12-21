import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "./CenteredModal.module.css";
import { useGetMenuQuery2 } from "../Utils/customQueryHooks";

function CenteredModal({ show, onHide, name, body, handleSave, handleCancel, err, total , totalTax }) {

      // const defaultPriceType = useSelector(state => state.bigMenu.defaultSettings.default_price_type)
      const { data: bigMenu } = useGetMenuQuery2();
      const defaultPriceType  = bigMenu?.defaultSettings?.default_price_type || "without_tax"
      const totalWithTax = total*(1+totalTax/100)

      return (
            <Modal
                  show={show}
                  onHide={onHide}
                  size="xl"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                  dialogClassName={styles.modal90}
                  animation={false}
                  backdrop="static"
                  className={styles.modal}>
                  <Modal.Header closeButton className={styles.modalHeader}>
                        <Modal.Title id="contained-modal-title-vcenter" className={styles.modalTitle}>
                              {name}
                        </Modal.Title>
                  </Modal.Header>
                  <Modal.Body className={styles.modalBody}>{body}</Modal.Body>
                  <Modal.Footer className={styles.modalFooter}>
                        {err && <div className="text-danger">{err}</div>}
                        <div className={styles.total}>Total : ₹ { defaultPriceType==="with_tax"? totalWithTax.toFixed(2) : total.toFixed(2)}</div>
                        <Button variant="btn btn-outline-secondary px-4" onClick={handleCancel}>
                              Cancel
                        </Button>
                        <Button variant="danger px-4" onClick={handleSave}>Save</Button>
                  </Modal.Footer>
            </Modal>
      );
}

export default CenteredModal;
