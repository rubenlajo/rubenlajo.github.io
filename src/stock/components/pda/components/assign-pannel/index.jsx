import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { T, intl } from "amiga-core/components/i18n";

import { Button } from "lib-frontsga";

import injectWarehouse from "application/connectors/injectWarehouse";
import injectUserNames from "application/connectors/injectUserNames";
import connectPda from "stock/connectors/connectPda";

import MobileSidePanel from "shared/components/mobile-slide-panel/";

import AssignUserListItem from "./components/assign-user-list-item";

import { getNameFromUserNames } from "@/utils/";

import "./styles.css";

function AssignPannel(props) {
  const {
    visible,
    close,
    onSelect,
    centerSelected,
    fetchWarehouseMovementTechnicians,
    technicians,
    clearWarhouseMovementTechnicians,
    fetchUserNames,
    userNames,
  } = props;

  const [technicianFilter, setTechnicianFilter] = useState("");
  const [selectedTechnician, setSelectedTechnician] = useState(false);

  useEffect(() => {
    if (centerSelected && !technicians.requestDone && !technicians.fetching && visible) {
      fetchWarehouseMovementTechnicians(centerSelected.centerId);
    }
  }, [centerSelected, technicians, visible]);

  const fetchingUserNames = useSelector(
    state => state.application.userNamesLoading
  );

  useEffect(() => {
    if (technicians?.list?.length > 0) {
      // Se recopilan los login de usuarios
      const userLogins = [];
      technicians.list?.forEach(technician => {
        if (technician.technnician && technician.technnician.technnicianLogin) {
          userLogins.push(technician.technnician.technnicianLogin);
        }
      });
      // Se obtienen los nombres de usuarios
      if (userLogins?.length > 0 && !fetchingUserNames) {
        fetchUserNames(userLogins);
      }
    }
  }, [technicians]);

  const filterTechnician = t => {
    if (!technicianFilter) {
      return true;
    } else {
      return (
        t.technnician.technnicianName.toLowerCase().includes(technicianFilter.toLowerCase()) ||
        t.technnician.technnicianLogin.toLowerCase().includes(technicianFilter.toLowerCase())
      );
    }
  };

  return (
    <MobileSidePanel
      className='assign-pannel'
      title={intl.formatMessage({
        id: "stock.routes.pda.assign-warehouse-movement",
      })}
      visible={visible}
      onClose={() => {
        close();
        clearWarhouseMovementTechnicians();
      }}
      searchText={technicianFilter}
      onSearch={search => setTechnicianFilter(search)}
    >
      {visible && (
        <>
          <div className='technicians-list'>
            {technicians.list
              .filter(filterTechnician)
              .map(({ technnician, assignmentsTotalNum, assignmentsMaxNum }) => (
                <AssignUserListItem
                  key={technnician.technnicianLogin}
                  login={technnician.technnicianLogin}
                  //name={technnician.technnicianName || "A A"}
                  name={getNameFromUserNames(userNames, technnician.technnicianLogin) || "A A"}
                  progress={`${assignmentsTotalNum}/${assignmentsMaxNum} ${intl.formatMessage({
                    id: "stock.pda.work-order-detail.assign.executed-orders",
                  })}`}
                  selected={
                    selectedTechnician &&
                    selectedTechnician.technnicianLogin === technnician.technnicianLogin
                  }
                  onSelect={() => setSelectedTechnician(technnician)}
                />
              ))}
          </div>
          {technicians.list.length === 0 && technicians.requestDone ? (
            <div className='no-technicians-found-msg'>
              <T id='stock.pda.work-order.assign.no-technicians-msg' />
            </div>
          ) : null}
          <Button
            kind='primary'
            disabled={!selectedTechnician}
            className='technician-assign-btn'
            onClick={() => {
              onSelect(selectedTechnician.technnicianLogin);
            }}
            label='Asignar'
          />
        </>
      )}
    </MobileSidePanel>
  );
}

export default injectWarehouse(connectPda(injectUserNames(AssignPannel)));
