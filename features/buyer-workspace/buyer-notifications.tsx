"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BuyerShell, Icon } from "./buyer-workspace";

const filters = ["All", "Matches", "Orders", "System"] as const;
const notifications = [
  { id: "match", title: "New match available", category: "Matches", icon: "05282", tone: "mint", age: "2h ago", unread: true },
  { id: "delivery", title: "Order delivered", category: "Orders", icon: "0fbc6", tone: "teal", age: "5h ago", unread: true },
  { id: "pickup", title: "Pickup scheduled", category: "Orders", icon: "acbb5", tone: "amber", age: "1d ago", unread: false },
  { id: "message", title: "New message", category: "System", icon: "f6f52", tone: "rose", age: "1d ago", unread: false },
  { id: "price", title: "Price update", category: "System", icon: "60366", tone: "orange", age: "2d ago", unread: false },
];

export function BuyerNotifications() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [read, setRead] = useState(false);
  const [menu, setMenu] = useState(false);
  const [feedback, setFeedback] = useState("");
  const visible = notifications.filter(item => filter === "All" || item.category === filter);
  return <BuyerShell screen="notifications">
    <Link className="buyer-notification-back" href="/preview/buyer"><Icon screen="notifications" file="047b5" />Back to Dashboard</Link>
    <div className="buyer-work-title buyer-notification-title"><div><h1>Notifications</h1><p>Stay updated on your matching produce, fulfillment orders, and supplier messages</p></div><div className="buyer-notification-actions"><Button variant="secondary" disabled={read} onClick={() => { setRead(true); setFeedback("Sample notifications marked as read in this preview only. Reloading restores them."); }}><Icon screen="notifications" file="96e60" />{read ? "All marked as read" : "Mark all as read"}</Button><Button variant="secondary" aria-label="Notification options" aria-expanded={menu} aria-controls="notification-options" onClick={() => setMenu(!menu)}><Icon screen="notifications" file="45c86" /></Button></div></div>
    {menu && <div id="notification-options" className="buyer-notification-options"><p>Notification preferences and older notifications will be available when the buyer API is connected.</p><Button variant="secondary" onClick={() => { setRead(false); setFeedback("Sample unread indicators restored."); setMenu(false); }}>Reset sample read state</Button></div>}
    <div className="buyer-notification-filters" role="group" aria-label="Filter notifications">{filters.map(value => <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{value}</button>)}</div>
    <p className="buyer-notification-status" role="status">{feedback || `${visible.length} sample notifications. Changes reset on reload.`}</p>
    <div className="buyer-notification-list">{visible.map(item => <Card key={item.id} className="buyer-notification-card"><span className={`buyer-notification-symbol ${item.tone}`}><Icon screen="notifications" file={item.icon} /></span><div className="buyer-notification-content"><h2>{item.title}{item.unread && !read && <span className="buyer-notification-unread" aria-label="Unread" />}</h2>
      {item.id === "match" && <><p>Maize Husks <span>from Adewale Farms</span></p><div className="buyer-notification-meta"><small className="mint">Waste Grade A</small><Link href="/preview/buyer-match">View Match Details →</Link></div></>}
      {item.id === "delivery" && <><p>Fresh Tomatoes <span>from Sunrise Farms</span></p><div className="buyer-notification-meta"><small>1,200 kg fulfilled</small><button disabled>Confirm Receipt →</button></div></>}
      {item.id === "pickup" && <><p>Cassava Peels <span>• Aug 26, 2026 • 10:00 AM</span></p><div className="buyer-notification-meta"><Icon screen="notifications" file="8614f" /><span>Oyo, Ibadan Farm Hub</span></div></>}
      {item.id === "message" && <><p><span>From </span>ABC Foods Ltd</p><blockquote>“Hello, we have confirmed the batch pickup dispatch time for tomorrow morning.”</blockquote></>}
      {item.id === "price" && <><p>Yellow Maize <span>• New price: </span><strong>₦620,000</strong></p><div className="buyer-notification-meta"><small className="orange">1,000 kg available</small><span>Grade A • Dry</span></div></>}
    </div><span className="buyer-notification-age">{item.age}</span></Card>)}</div>
    <div className="buyer-notification-footer"><p>Showing saved sample notifications from the design</p><button disabled>View Older Notifications</button></div><p className="buyer-work-service-note">Match actions, receipt confirmation, messages and notification history await their backend contracts.</p>
  </BuyerShell>;
}
