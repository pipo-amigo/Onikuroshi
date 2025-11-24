import React, { useState, useEffect } from "react";


export const AnnouncementBar = () => {
const messages = [
"Very limited stock!",
"Only 105.000 away from free shipping!",
"Prices down to 40 DT!!",
"Skip to content",
];


const [index, setIndex] = useState(0);


useEffect(() => {
const interval = setInterval(() => {
setIndex((prev) => (prev + 1) % messages.length);
}, 3000);
return () => clearInterval(interval);
}, []);


return (
<div className="w-full bg-white text-black text-sm py-2 text-center font-serif font-semibold">
{messages[index]}
</div>
);
};