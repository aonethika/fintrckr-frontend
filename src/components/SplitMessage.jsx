
// import { useSelector, useDispatch } from "react-redux";
// import { QRCodeCanvas } from "qrcode.react";
// import {
//   markSplitPaid,
//   confirmSplitPayment,
//   fetchGroupById,
// } from "../redux/slices/groupSlice";
// import "../styles/splitMessage.css";
// import { useState } from "react";

// function SplitMessage({ msg, groupId }) {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);

//   const [showPayUI, setShowPayUI] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showMore, setShowMore] = useState(false);

//   if (!msg?.expense || !user) return null;

//   const myUserId = (user._id || user.id)?.toString();
//   const expense = msg.expense;

//   const payerId = typeof msg.payer === "object" ? msg.payer._id : msg.payer;
//   const isPayer = payerId?.toString() === myUserId;

//   const mySplit = expense.splits?.find(
//     (s) => (s.user?._id || s.user)?.toString() === myUserId
//   );
//   const amount = mySplit?.amount || 0;
//   const status = mySplit?.status;

//   const canPay = status === "unpaid";
//   const iPaid = status === "paid";

//   const upiId = msg.upiId || "Scan";
//   const note = expense.title || "";
//   const upiUrl = `upi://pay?pa=${upiId}&pn=GroupExpense&am=${amount}&cu=INR&tn=${encodeURIComponent(
//     note
//   )}`;

//   const handleMarkPaid = async (e) => {
//     e.stopPropagation();
//     setLoading(true);
//     await dispatch(markSplitPaid({ expenseId: expense._id, groupId }));
//     await dispatch(fetchGroupById(groupId));
//     setShowPayUI(false);
//     setLoading(false);
//   };

//   const handleConfirm = async (e, memberId) => {
//     e.stopPropagation();
//     setLoading(true);
//     await dispatch(confirmSplitPayment({ expenseId: expense._id, memberId, groupId }));
//     await dispatch(fetchGroupById(groupId));
//     setLoading(false);
//   };

//   return (
//     <div className="split-wrapper">
//       <p className="split-title">Split: {expense.title}</p>
//       <p className="money">₹{amount}</p>

//       {iPaid && <p>✅ You paid</p>}

//       {canPay && !isPayer && !showPayUI && (
//         <button onClick={() => setShowPayUI(true)}>Pay</button>
//       )}

//       <div className="show-more-full" onClick={() => setShowMore((prev) => !prev)}>
//         {showMore ? (
//           <p className="show-more-full-hide">Hide details</p>
//         ) : (
//           <p>Show more details</p>
//         )}
//       </div>

//       {showMore && (
//         <div className="split-details">
//           <p className="total">Total: ₹{expense.amount}</p>
//           {expense.splits?.map((s) => {
//             const share = s.amount
//             console.log(s.amount);
            
//             const memberName = s.user?.name || "Member";
//             const memberStatus = s.status;

//             return (
//               <div key={s.user?._id || s.user} className="member-status">
//                 <span>{memberName}</span>
//                 <span className="memeber-share"><b> ₹{share}</b></span>
//                 <span
//                   className={`status-badge ${
//                     memberStatus === "paid"
//                       ? "paid"
//                       : memberStatus === "unpaid"
//                       ? "unpaid"
//                       : "requested"
//                   }`}
//                 >
//                   {memberStatus === "paid" && " Paid"}
//                   {memberStatus === "unpaid" && " Unpaid"}
//                   {memberStatus === "requested" && " Requested"}
//                 </span>

//                 {isPayer && memberStatus === "requested" && (
//                   <button
//                     className="btn confirm-btn"
//                     onClick={(e) => handleConfirm(e, s.user?._id || s.user)}
//                     disabled={loading}
//                   >
//                     Confirm
//                   </button>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {showPayUI && (
//         <div className="upi-container">
//           <QRCodeCanvas value={upiUrl} size={140} />
//           <button onClick={handleMarkPaid} disabled={loading}>
//             I have paid
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default SplitMessage;


import { useSelector, useDispatch } from "react-redux";
import { QRCodeCanvas } from "qrcode.react";
import { markSplitPaid, fetchGroupById } from "../redux/slices/groupSlice";
import "../styles/splitMessage.css";
import { useState } from "react";

function SplitMessage({ msg, groupId }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [showPayUI, setShowPayUI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  if (!msg?.expense || !user) return null;

  const myUserId = (user._id || user.id)?.toString();
  const expense = msg.expense;

  const payerId = typeof msg.payer === "object" ? msg.payer._id : msg.payer;
  const isPayer = payerId?.toString() === myUserId;

  const mySplit = expense.splits?.find(
    (s) => (s.user?._id || s.user)?.toString() === myUserId
  );
  const amount = mySplit?.amount || 0;
  const status = mySplit?.status;

  const canPay = status === "unpaid";
  const iPaid = status === "paid";

  const upiId = msg.upiId || "Scan";
  const note = expense.title || "";
  const upiUrl = `upi://pay?pa=${upiId}&pn=GroupExpense&am=${amount}&cu=INR&tn=${encodeURIComponent(
    note
  )}`;

  const handleMarkPaid = async (e) => {
    e.stopPropagation();
    setLoading(true);
    await dispatch(markSplitPaid({ expenseId: expense._id, groupId }));
    await dispatch(fetchGroupById(groupId));
    setShowPayUI(false);
    setLoading(false);
  };

  return (
    <div className="split-wrapper">
      <p className="split-title">Split: {expense.title}</p>
      <p className="money">₹{amount}</p>

      {iPaid && <p>✅ You paid</p>}

      {canPay && !isPayer && !showPayUI && (
        <button onClick={() => setShowPayUI(true)}>Pay</button>
      )}

      <div className="show-more-full" onClick={() => setShowMore((prev) => !prev)}>
        {showMore ? (
          <p className="show-more-full-hide">Hide details</p>
        ) : (
          <p>Show more details</p>
        )}
      </div>

      {showMore && (
        <div className="split-details">
          <p className="total">Total: ₹{expense.amount}</p>
          {expense.splits?.map((s) => {
            const share = s.amount;
            const memberName = s.user?.name || "Member";
            const memberStatus = s.status;

            return (
              <div key={s.user?._id || s.user} className="member-status">
                <span>{memberName}</span>
                <span className="memeber-share"><b> ₹{share}</b></span>
                <span
                  className={`status-badge ${
                    memberStatus === "paid"
                      ? "paid"
                      : memberStatus === "unpaid"
                      ? "unpaid"
                      : "requested"
                  }`}
                >
                  {memberStatus === "paid" && " Paid"}
                  {memberStatus === "unpaid" && " Unpaid"}
                  {memberStatus === "requested" && " Requested"}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {showPayUI && (
        <div className="upi-container">
          <QRCodeCanvas value={upiUrl} size={140} />
          <button onClick={handleMarkPaid} disabled={loading}>
            I have paid
          </button>
        </div>
      )}
    </div>
  );
}

export default SplitMessage;