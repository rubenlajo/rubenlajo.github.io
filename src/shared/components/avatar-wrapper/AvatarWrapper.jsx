import React from "react";

import { AvatarGroup, Avatar, Tooltip } from "lib-frontsga";

import injectDevice from "@/application/components/sga-layout/inject-device";
import { getUserName, getUserNameAbbrByName, getUserAutoAbbr } from "@/utils";

import "./styles.css";

function AvatarWrapper({
  // Funcion usada para comprobar si se tiene que cargar una foto de servidor o no. Sirve para evitar peticiones duplicadas al
  // servidor a la hora de mostrar varios AvatarWrapper de forma simultánea
  className,
  users = [],
  max = 3,
  userPhotos = {},
  height,
  label,
  compact = true,
  size = "size-m",
  useOverlap = false,
  device,
}) {
  //Funcion para saber si estamos en versión desktop (devuelve un boolean)
  const isDesktop = () => {
    const { desktop } = device;

    return desktop;
  };

  return (
    <div className={compact ? `avatar-wrapper` : ""}>
      {label ? (
        users?.map(({ login, name }) => {
          const username = name && name.length > 0 ? name : getUserName(login);
          const nameAbbr =
            name && name.length > 0 ? getUserNameAbbrByName(username) : getUserAutoAbbr(username);

          return (
            <Tooltip content={name} canBeShown={() => isDesktop()}>
              <Avatar
                key={name}
                label={label}
                className={`avatar__item ${className}`}
                image={
                  userPhotos[username] ? `data:image/jpeg;base64,${userPhotos[username]}` : null
                }
                name={username.toUpperCase()}
                size={size}
                abbr={nameAbbr}
              />
            </Tooltip>
          );
        })
      ) : (
        <AvatarGroup useOverlap={useOverlap} max={max} height={height} size={size}>
          {users?.map(({ login, name }) => {
            const username = name && name.length > 0 ? name : getUserName(login);
            const nameAbbr =
              name && name.length > 0 ? getUserNameAbbrByName(username) : getUserAutoAbbr(username);
            return (
              <Tooltip content={name} canBeShown={() => isDesktop()}>
                <Avatar
                  key={name}
                  label={label}
                  className={`avatar__item ${className}`}
                  image={
                    userPhotos[username] ? `data:image/jpeg;base64,${userPhotos[username]}` : null
                  }
                  name={username.toUpperCase()}
                  size={size}
                  abbr={nameAbbr}
                  isPartOfAGroup
                />
              </Tooltip>
            );
          })}
        </AvatarGroup>
      )}
    </div>
  );
}

export default injectDevice(AvatarWrapper);
