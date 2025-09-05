export default function requestWindow() {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <span>Select For Your Request</span>
          <button className="close-btn">×</button>
        </div>
        <div className="modal-content">
          <div className="task-row">
            <span>{}</span>
            <span>{}฿</span>
            <span>{}</span>
            <input type="checkbox" />
          </div>
          <img src="#" alt="Avatar" className="avatar" />
        </div>
        <div className="modal-footer">
          <button className="submit-btn">Submit</button>
        </div>
      </div>
    </div>
  );
}
