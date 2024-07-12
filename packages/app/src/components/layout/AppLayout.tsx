import React from 'react'
import { makeStyles } from '@material-ui/core'
import { ZodiacPaper } from 'zodiac-ui-components'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'grid',
    height: 'calc(100% - 70px)',
    gridTemplateColumns: '390px 1fr',
    gridGap: theme.spacing(0.5),
    overflow: 'hidden',
    padding: theme.spacing(0.5),
  },
  leftPanel: {
    overflowY: 'auto',
  },
  content: {
    overflowY: 'auto',
  },
}))

interface AppLayoutProps {
  children: React.ReactNode
  left: React.ReactElement
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, left }) => {
  const classes = useStyles()
  return (
    <ZodiacPaper
      variant='outlined'
      className={classes.root}
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <ZodiacPaper
        variant='outlined'
        className={classes.content}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        {left}
      </ZodiacPaper>
      <ZodiacPaper
        variant='outlined'
        id='app-content'
        className={classes.content}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        {children}
      </ZodiacPaper>
    </ZodiacPaper>
  )
}
