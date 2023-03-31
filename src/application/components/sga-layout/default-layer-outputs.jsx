import React from "react";
import DropdownLayerOutput from "amiga-core/components/dropdown/dropdown-layer-output";
import TooltipLayerOutput from "amiga-core/components/tooltip/tooltip-layer-output";
import LoaderLayerOutput from "amiga-core/components/loader/loader-layer-output";
import ModalLayerOutput from "amiga-core/components/modal/modal-layer-output";
import GridModalLayerOutput from "amiga-core/components/grid/components/grid-modal-layer-output";
import HelpLayerOutput from "amiga-core/components/help/help-layer-output";
import ContextMenuLayerOutput from "amiga-core/components/context-menu/context-menu-layer-output";
import MeasureLayerOutput from "amiga-core/components/layout/measure-layer-output";

const DefaultLayerOutputs = () => (
  <div>
    <ModalLayerOutput />
    <DropdownLayerOutput />
    <TooltipLayerOutput />
    <ContextMenuLayerOutput />
    <HelpLayerOutput />
    <GridModalLayerOutput />
    <LoaderLayerOutput />
    <MeasureLayerOutput />
  </div>
);

export default DefaultLayerOutputs;
