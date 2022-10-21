import "../styles/ContactCard.css";
import React from "react";

function ContactCard({ Id, Name, Position, Org, Email, Phone, Delete, Edit }) {
  const Mailto = "mailto:" + Email;
  return (
    <div>
      <main>
        <div className="contact_card">
          <button type="button" onClick={() => Edit()}>
            <img className="edit" src="/img/edit_icon2.svg" />
          </button>
          <button className="delete" type="button" onClick={() => Delete()}>
            <img src="/img/delete_icon2.svg" />
          </button>
          <div className="card_back" />
          <img alt="User" src="/img/contact_icon.svg" className="contact_icon" />
          <div className="card_name">{Name}</div>
          <div className="position" id="pos1">
            {Position}
          </div>
          <div className="position">{Org}</div>
          <div className="info" id="info1">
            <a href={Mailto}>{Email}</a>
          </div>
          <div className="info">{Phone}</div>
        </div>
      </main>
    </div>
  );
}

// function Whoto() {
//   return (
//     <div>
//       <main>
//         <div className="whotocard">
//           <div className="counter">
//             <p>1</p>
//           </div>
//           <div className="heading">
//             <p>Volunteer Assignment</p>
//           </div>
//           <div className="description">
//             <p>
//               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id sed nibh orci condimentum
//               blandit. Feugiat viverra quam ornare venenatis in odio mi
//             </p>
//           </div>
//           <div className="grid">
//             <div>Charlie Lerner x100</div>
//             <div>Charlie Lerner x100</div>
//             <div>Charlie Lerner x100</div>
//             <div>Charlie Lerner x100</div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

export default ContactCard;
