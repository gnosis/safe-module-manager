import { makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { Module } from "../../store/modules/models";
import { setCurrentModule } from "../../store/modules";
import { useRootDispatch, useRootSelector } from "../../store";
import {
  getCurrentModule,
  getIsLoadingModules,
  getPendingModules,
  getPendingRemoveModuleTransactions,
  getSafeThreshold,
} from "../../store/modules/selectors";
import { ReactComponent as AvatarEmptyIcon } from "../../assets/icons/avatar-empty.svg";
import { Skeleton } from "@material-ui/lab";
import { PANEL_ITEM_HEIGHT, PanelItem } from "./Items/PanelItem";
import { ModuleItem } from "./Items/ModuleItem";
import { resetNewTransaction } from "../../store/transactionBuilder";
import { PendingModuleStates } from "./PendingModuleStates";
import { Column } from "../../components/layout/Column";
import { isPendingModule } from "../../store/modules/helpers";

interface ModuleListProps {
  modules: Module[];
  sub?: boolean;
}

const useStyles = makeStyles((theme) => ({
  root: {
    overflowX: "hidden",
  },
  subModules: {
    position: "relative",
    marginLeft: theme.spacing(10),
  },
  line: {
    position: "absolute",
    borderColor: theme.palette.primary.light,
    borderStyle: "solid",
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 16,
    top: 0,
    left: -40,
    width: 40,
  },
  emptyModulesText: {
    maxWidth: 200,
    fontSize: 16,
    color: "rgba(0,20,40,0.5)",
  },
}));

export const ModuleList = ({ modules, sub = false }: ModuleListProps) => {
  const classes = useStyles();

  const dispatch = useRootDispatch();
  const currentModule = useRootSelector(getCurrentModule);
  const modulesLoading = useRootSelector(getIsLoadingModules);
  const pendingModules = useRootSelector(getPendingModules);
  const safeThreshold = useRootSelector(getSafeThreshold);
  const pendingRemoveTxs = useRootSelector(getPendingRemoveModuleTransactions);

  const handleClick = (module: Module) => {
    dispatch(setCurrentModule(module));
    dispatch(resetNewTransaction());
  };

  if (modulesLoading) {
    return (
      <PanelItem image={<Skeleton variant="circle" width={40} height={40} />}>
        <Skeleton width={160} height={20} />
        <Skeleton width={100} height={20} />
      </PanelItem>
    );
  }

  if (!modules.length && !pendingModules.length) {
    return (
      <PanelItem image={<AvatarEmptyIcon />}>
        <Typography className={classes.emptyModulesText}>
          Modules will appear here once added
        </Typography>
      </PanelItem>
    );
  }

  const content = modules.map((module) => {
    const active = module.id === currentModule?.id;
    const remove = pendingRemoveTxs.some((tx) => isPendingModule(module, tx));
    return (
      <ModuleItem
        key={module.address}
        remove={remove}
        instant={safeThreshold === 1}
        module={module}
        active={active}
        sub={sub}
        onClick={() => handleClick(module)}
      />
    );
  });

  if (sub) {
    const lines = modules.map((_, index) => {
      const previous = index && modules[index - 1];
      const subModulesCount = previous && previous.subModules.length;
      const subModulesHeight = subModulesCount * PANEL_ITEM_HEIGHT;

      const height =
        2 +
        subModulesHeight +
        PANEL_ITEM_HEIGHT * (index + 1) -
        PANEL_ITEM_HEIGHT / 2;
      return <div key={index} className={classes.line} style={{ height }} />;
    });
    return <div className={classes.subModules}>{[content, lines]}</div>;
  }

  return (
    <Column className={classes.root}>
      <PendingModuleStates />
      {content}
    </Column>
  );
};
