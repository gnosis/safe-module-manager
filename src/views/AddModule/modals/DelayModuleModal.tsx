import React, { useState } from "react";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { AddModuleModal } from "./AddModuleModal";
import { ReactComponent as DelayModuleImage } from "../../../assets/images/delay-module.svg";
import { TimeSelect } from "../../../components/input/TimeSelect";
import { deployDelayModule } from "services";

interface DaoModuleModalProps {
  open: boolean;

  onClose?(): void;

  onSubmit?(): void;
}

interface DelayModuleParams {
  expiration: string;
  cooldown: string;
}

const useStyles = makeStyles((theme) => ({
  fields: {
    marginBottom: theme.spacing(1),
  },
  loadMessage: {
    textAlign: "center",
  },
}));

export const DelayModuleModal = ({
  open,
  onClose,
  onSubmit,
}: DaoModuleModalProps) => {
  const classes = useStyles();

  const { sdk, safe } = useSafeAppsSDK();

  const [params, setParams] = useState<DelayModuleParams>({
    expiration: "86400",
    cooldown: "86400",
  });

  const onParamChange = <Field extends keyof DelayModuleParams>(
    field: Field,
    value: DelayModuleParams[Field]
  ) => {
    setParams({
      ...params,
      [field]: value,
    });
  };

  const handleAddDelayModule = async () => {
    try {
      const txs = deployDelayModule(safe.safeAddress, safe.chainId, {
        executor: safe.safeAddress,
        cooldown: params.cooldown,
        expiration: params.expiration,
      });

      await sdk.txs.send({ txs });

      if (onSubmit) onSubmit();
      if (onClose) onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AddModuleModal
      open={open}
      onClose={onClose}
      title="Transaction Delay"
      description="Adds a settable delay time to any transaction originating from this module."
      image={<DelayModuleImage />}
      tags={["Stackable", "From Gnosis"]}
      onAdd={handleAddDelayModule}
      readMoreLink="https://github.com/gnosis/SafeDelay"
    >
      <Typography variant="h6" gutterBottom>
        Parameters
      </Typography>

      <Grid container spacing={2} className={classes.fields}>
        <Grid item xs={6}>
          <TimeSelect
            label="Cooldown"
            defaultValue={params.cooldown}
            defaultUnit="hours"
            onChange={(value) => onParamChange("cooldown", value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TimeSelect
            label="Expiration"
            defaultValue={params.expiration}
            defaultUnit="hours"
            onChange={(value) => onParamChange("expiration", value)}
          />
        </Grid>
      </Grid>
    </AddModuleModal>
  );
};
