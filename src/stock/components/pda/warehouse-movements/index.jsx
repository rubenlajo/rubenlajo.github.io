import React, { useEffect, useState } from "react";
import { history } from "amiga-core/components/router";
import { T, intl } from "amiga-core/components/i18n";
import injectUser from "application/connectors/injectUser";
import { moment } from "amiga-core/application/i18n/moment";

import { Button, ListItemMetadata } from "lib-frontsga";

import injectWarehouse from "application/connectors/injectWarehouse";
import PageMobile from "shared/components/page-mobile/";
import connectPda from "stock/connectors/connectPda";
import { dateFormat, dateFormatEN } from "@/generalConfig";
import { getUserName } from "@/utils/";
import builder from "@rsql/builder";
import { emit } from "@rsql/emitter";

//Campo por el que se ordenan las órdenes de trabajos
const WORKORDERS_ORDER_FIELD = "creationDate";
let timer = null;

function WarehouseMovements(props) {
  const { type, user, centerSelected, warehouseMovements, fetchWarehouseMovements } = props;

  const [searchText, setSearchText] = useState("");
  const [order, setOrder] = useState("DESC");
  const [offset, setOffset] = useState(0);
  const [limit] = useState(50);

  useEffect(() => {
    if (centerSelected) {
      filterWarehouseMovements();
    }
  }, [centerSelected, order, searchText, offset]);

  const filterWarehouseMovements = () => {
    let query = null;
    if (type === "assigned") {
      query = builder.and(
        builder.in("warehouseMovementStatusId", [1, 2, 4]),
        builder.eq("assignedUser", user.login)
      );
    } else {
      query = builder.and(
        builder.in("warehouseMovementStatusId", [1, 4]),
        builder.neq("assignedUser", user.login)
      );
    }

    if (searchText) {
      query = builder.and(query, builder.eq("warehouseMovementId", searchText + "*"));
    }

    const filters = {
      offset: offset,
      limit: limit,
      order: `${order === "DESC" ? "-" : ""}${WORKORDERS_ORDER_FIELD}`,
      query: emit(query),
    };

    fetchWarehouseMovements(centerSelected.centerId, filters);
  };

  return (
    <PageMobile
      title={intl.formatMessage({ id: `stock.pda.work-orders.${type}.title` })}
      breadcrumb={intl.formatMessage({ id: `stock.pda.work-orders.${type}.breadcrumb` })}
      onSearch={newSearch => {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          setSearchText(newSearch);
          setOffset(0);
        }, 1000);
      }}
      searchValue={searchText}
      order={order}
      onOrder={newOrder => {
        setOffset(0);
        setOrder(newOrder);
      }}
      onBack={() => history.push("/stock/pda/dashboard")}
      contentScroll
      resourceName='warehouseMovementsPage'
    >
      {warehouseMovements.list.map(workOrder => {
        const chips = [
          {
            label: moment(workOrder.creationDate).format(
              intl.locale === "es" ? dateFormat : dateFormatEN
            ),
            color: "#b5b5b5",
            backgroundColor: "#363636",
            info: true,
          },
        ];

        if (workOrder.progressPercent && workOrder.progressPercent > 0) {
          chips.push({
            label: `${workOrder.progressPercent}% ${intl.formatMessage({
              id: "stock.pda.work-orders.process.completed",
            })}`,
            color: "#E4979D",
            backgroundColor: "#363636",
            info: true,
          });
        }

        let element = "";
        if (workOrder.locations && workOrder.locations.length === 1) {
          element = workOrder.locations[0].locationName;
        } else if (workOrder.materials && workOrder.materials.length === 1) {
          element = workOrder.materials[0].materialName.name;
        }

        return (
          <ListItemMetadata
            key={workOrder.warehouseMovementId}
            id={workOrder.warehouseMovementId}
            title={workOrder.warehouseMovementId + ""}
            subtitle={`${workOrder.warehouseMovementType.warehouseMovementTypeName} ${element}`}
            icon='sga-icon-angle-right'
            onClick={orderId => history.push(`/stock/pda/warehouse-movements/${orderId}`)}
            chips={chips}
            //No se puede cambiar el avatar, ya que es un componente de la libreria.
            avatar={
              type !== "assigned" && workOrder.assignedUsers && workOrder.assignedUsers.length > 0
                ? {
                    name: getUserName(workOrder.assignedUsers[0].assignedUser).toUpperCase(),
                  }
                : null
            }
          />
        );
      })}
      <Button
        kind='tertiary'
        className='w100'
        disabled={!warehouseMovements.haveMore}
        onClick={() => setOffset(offset + limit)}
        label={intl.formatMessage({ id: "stock.pda.list.load-more" })}
      />
    </PageMobile>
  );
}

export default injectWarehouse(injectUser(connectPda(WarehouseMovements)));
