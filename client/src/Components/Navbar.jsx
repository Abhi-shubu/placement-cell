import React from 'react';

import './Nvbar.css'; // Import your CSS file for navbar styling

const Navbar = () => {
  return (
   <div>

     <ul>
  
  <li><a class="active" href="/home">home</a></li>
  <li><a href="/batch">Batches</a></li>
  <li><a href="/student">Student details</a></li>
  <li><a href="/interview">Interview</a></li>

</ul>
   </div>
  );
}

export default Navbar;