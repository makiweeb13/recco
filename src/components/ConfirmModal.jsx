import PropTypes from 'prop-types';

function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
                <p className="modal-message">{message}</p>
                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onCancel}>Cancel</button>
                    <button className="modal-confirm-btn" onClick={onConfirm}>Delete</button>
                </div>
            </div>
        </div>
    );
}

ConfirmModal.propTypes = {
    message: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default ConfirmModal;
