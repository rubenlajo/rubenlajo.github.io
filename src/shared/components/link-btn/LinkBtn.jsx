import React from "react";
import { Icon } from "lib-frontsga";

import "./styles.css";

function LinkBtn({ label, icon, iconPosition, onClick, cursorPointer }) {
  const iconDiv = <Icon icon={icon} iconColor='#e6e6e6' size='size-xs' />;

  return (
    <div
      className='link-btn'
      style={{ cursor: cursorPointer ? cursorPointer : "pointer" }}
      onClick={e => onClick(e)}
    >
      {icon && (iconPosition === "start" || !iconPosition) ? iconDiv : null}
      {label ? <span>{label}</span> : null}
      {icon && iconPosition === "end" ? iconDiv : null}
    </div>
  );
}

export default LinkBtn;
