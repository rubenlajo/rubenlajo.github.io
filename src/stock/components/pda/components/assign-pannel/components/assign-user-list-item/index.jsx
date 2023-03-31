import React from "react";

import { Chip, Radio } from "lib-frontsga";

import "./styles.css";
import AvatarWrapper from "@/shared/components/avatar-wrapper/AvatarWrapper";

function AssignUserListItem({ name, login, progress, selected, onSelect }) {
  return (
    <div className='assign-user-list-item' onClick={() => onSelect()}>
      <AvatarWrapper className="assign-user-avatar" users={[{ login, name }]} />
      <div className='assign-user-list-content'>
        <div className='assign-user-name'>{name}</div>
        <div className='assign-user-progress'>
          <Chip
            label={progress}
            color='var(--color-neutral100, #B5B5B5)'
            backgroundColor='var(--color-neutral600, #363636)'
            info
          />
        </div>
      </div>
      <Radio label='' value={selected} />
    </div>
  );
}

export default AssignUserListItem;
