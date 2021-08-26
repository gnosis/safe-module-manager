import React from "react";
import {
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
} from "@material-ui/lab";
import { withStyles } from "@material-ui/core";

const StyledToggleButton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.common.white + " !important",
    borderColor: theme.palette.secondary.main,
    padding: theme.spacing(1, 2.5),
    "& span": {
      fontFamily: theme.typography.fontFamily,
      fontSize: 16,
      textTransform: "none",
      color: theme.palette.secondary.main + " !important",
    },
    "&.Mui-disabled": {
      opacity: 0.5,
    },
  },
  selected: {
    backgroundColor: theme.palette.secondary.main + " !important",
    "& span": {
      color: theme.palette.common.white + " !important",
    },
  },
}))(ToggleButton);

interface ContractOperationToggleButtonsProps extends ToggleButtonGroupProps {
  disabled?: boolean;
}

export const ContractOperationToggleButtons = ({
  disabled = false,
  ...props
}: ContractOperationToggleButtonsProps) => {
  return (
    <ToggleButtonGroup exclusive size="small" {...props}>
      <StyledToggleButton disabled={disabled} value="read" disableRipple>
        Read Contract
      </StyledToggleButton>
      <StyledToggleButton disabled={disabled} value="write" disableRipple>
        Write Contract
      </StyledToggleButton>
    </ToggleButtonGroup>
  );
};
