// import React, { useEffect, useRef, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import SplitMessage from "./SplitMessage";
// import SplitSummaryCard from "./SplitSummaryCard";
// import { addGroupMessage } from "../redux/slices/groupSlice";
// import "../styles/chatArea.css";

// function ChatArea() {
//   const dispatch = useDispatch();
//   const group = useSelector((state) => state.groups.currentGroup);
//   const currentUser = useSelector((state) => state.auth.user);

//   const [newMessage, setNewMessage] = useState("");
//   const containerRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const firstLoadRef = useRef(true);
//   const isUserAtBottomRef = useRef(true);

//   const messages = group?.messages || [];
//   const myUserId = (currentUser?._id || currentUser?.id)?.toString();

//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;
//     if (firstLoadRef.current) {
//       container.scrollTop = container.scrollHeight;
//       firstLoadRef.current = false;
//       return;
//     }
//     requestAnimationFrame(() => {
//       if (isUserAtBottomRef.current) {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//       }
//     });
//   }, [messages.length]);

//   const handleScroll = () => {
//     const container = containerRef.current;
//     if (!container) return;
//     isUserAtBottomRef.current =
//       container.scrollHeight - container.scrollTop - container.clientHeight < 50;
//   };

//   const handleSendMessage = () => {
//     if (!newMessage.trim()) return;
//     if (!group?._id) return;
//     dispatch(
//       addGroupMessage({
//         groupId: group._id,
//         message: { text: newMessage.trim() },
//       })
//     );
//     setNewMessage("");
//   };

//   const formatSystemText = (msg) => {
//     const senderName = msg.sender?.name || "Someone";
//     switch (msg.type) {
//       case "system":
//       case "group_fully_settled":
//         return <span className="system-message">{msg.text}</span>;
//       case "payment_requested":
//         return (
//           <span className="payment-requested">
//             <b>{senderName}:</b> {msg.text}
//           </span>
//         );
//       case "split_settled":
//         return (
//           <span className="split-settled">
//             <b>{senderName}:</b> {msg.text}
//           </span>
//         );
//       case "payment_confirmed_member": {
//         const receiverId = msg.receiver
//           ? msg.receiver.toString()
//           : msg.expense?.user
//           ? msg.expense.user.toString()
//           : null;
//         if (!receiverId) return null;
//         if (receiverId === myUserId) {
//           return <span className="payment-confirmed-member">{msg.text}</span>;
//         }
//         return null;
//       }
//       default:
//         return msg.text || null;
//     }
//   };

//   return (
//     <div className="chat-wrapper">
//       <div
//         className="message-container"
//         ref={containerRef}
//         onScroll={handleScroll}
//       >
//         {messages.map((msg, i) => {
//           const senderId = (msg.sender?._id || msg.sender)?.toString();
//           const isMe = senderId === myUserId;

//           if (msg.type === "system" || msg.type === "group_fully_settled") {
//             return (
//               <span key={msg._id || i} className="system-message">
//                 {msg.text}
//               </span>
//             );
//           }

//           let content = null;
//           if (msg.type === "text") {
//             content = (
//               <div className="text-message">
//                 <b>{isMe ? "You" : msg.sender?.name}:</b> {msg.text}
//               </div>
//             );
//           } else if (msg.type === "split") {
//             content = <SplitMessage msg={msg} groupId={group._id} />;
//           } else {
//             const formatted = formatSystemText(msg);
//             if (formatted)
//               content = <div className="text-message">{formatted}</div>;
//           }

//           if (!content) return null;

//           return (
//             <div
//               key={msg._id || i}
//               className={`message-wrapper ${isMe ? "me" : "other"}`}
//             >
//               {content}
//             </div>
//           );
//         })}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="message-input">
//         <input
//           value={newMessage}
//           placeholder="Type a message..."
//           onChange={(e) => setNewMessage(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//         />
//         <button onClick={handleSendMessage}>Send</button>
//       </div>
//     </div>
//   );
// }

// export default ChatArea;


import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SplitMessage from "./SplitMessage";
import { addGroupMessage, confirmSplitPayment, fetchGroupById } from "../redux/slices/groupSlice";
import "../styles/chatArea.css";

function ChatArea() {
  const dispatch = useDispatch();
  const group = useSelector((state) => state.groups.currentGroup);
  const currentUser = useSelector((state) => state.auth.user);

  const [newMessage, setNewMessage] = useState("");
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const firstLoadRef = useRef(true);
  const isUserAtBottomRef = useRef(true);

  const messages = group?.messages || [];
  const myUserId = (currentUser?._id || currentUser?.id)?.toString();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (firstLoadRef.current) {
      container.scrollTop = container.scrollHeight;
      firstLoadRef.current = false;
      return;
    }
    requestAnimationFrame(() => {
      if (isUserAtBottomRef.current) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    });
  }, [messages.length]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    isUserAtBottomRef.current =
      container.scrollHeight - container.scrollTop - container.clientHeight < 50;
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    if (!group?._id) return;
    dispatch(
      addGroupMessage({
        groupId: group._id,
        message: { text: newMessage.trim() },
      })
    );
    setNewMessage("");
  };

  const handleConfirm = async (msg, memberId) => {
    if (!group?._id) return;
    await dispatch(confirmSplitPayment({ expenseId: msg.expense._id, memberId, groupId: group._id }));
    await dispatch(fetchGroupById(group._id));
  };

  const formatSystemText = (msg) => {
  
    
    const senderName = msg.sender?.name || "Someone";
    switch (msg.type) {
      case "system":
      case "group_fully_settled":
        return <span className="system-message">{msg.text}</span>;
      case "payment_requested":
        return (
          <div className="payment-request-wrapper">
            <span className="payment-requested">
              <b>{senderName}:</b> {msg.text}
            </span>
           {msg.expense?.payer?.toString() === myUserId &&
  msg.expense?.splits?.map(s => 
    s.status === "requested" && (
      <button
        key={s.user._id}
        className="btn confirm-btn"
        onClick={() => handleConfirm(msg, s.user._id)}
      >
        Confirm
      </button>
    )
  )}
          </div>
        );
      case "split_settled":
        return (
          <span className="split-settled">
            <b>{senderName}:</b> {msg.text}
          </span>
        );
      case "payment_confirmed_member": {
        const receiverId = msg.receiver
          ? msg.receiver.toString()
          : msg.expense?.user
          ? msg.expense.user.toString()
          : null;
        if (!receiverId) return null;
        if (receiverId === myUserId) {
          return <span className="payment-confirmed-member">{msg.text}</span>;
        }
        return null;
      }
      default:
        return msg.text || null;
    }
  };

  return (
    <div className="chat-wrapper">
      <div
        className="message-container"
        ref={containerRef}
        onScroll={handleScroll}
      >
        {messages.map((msg, i) => {
          const senderId = (msg.sender?._id || msg.sender)?.toString();
          const isMe = senderId === myUserId;

          let content = null;
          if (msg.type === "text") {
            content = (
              <div className="text-message">
                <b>{isMe ? "You" : msg.sender?.name}:</b> {msg.text}
              </div>
            );
          } else if (msg.type === "split") {
            content = <SplitMessage msg={msg} groupId={group._id} />;
          } else {
            const formatted = formatSystemText(msg);
            if (formatted) content = <div className="text-message">{formatted}</div>;
          }

          if (!content) return null;

          return (
           <div
  key={msg._id || i}
  className={`message-wrapper ${
    msg.type === "system" || msg.type === "group_fully_settled"
      ? "system"
      : isMe
      ? "me"
      : "other"
  }`}
>
  {content}
</div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input">
        <input
          value={newMessage}
          placeholder="Type a message..."
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatArea;