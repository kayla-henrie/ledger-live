// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { shell, remote } from 'electron'
import qs from 'querystring'
import { translate } from 'react-i18next'

import { rgba } from 'styles/helpers'
import db from 'helpers/db'

import type { T } from 'types/common'

import ExportLogsBtn from 'components/ExportLogsBtn'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import TranslatedError from './TranslatedError'

type Props = {
  error: Error,
  t: T,
  disableExport?: boolean,
  children?: *,
}

const Container = styled(Box).attrs({
  grow: true,
  align: 'center',
  justify: 'center',
  bg: 'lightGraphite',
  color: 'alertRed',
  ff: 'Museo Sans|Bold',
  flow: 2,
})``

const Inner = styled(Box).attrs({
  p: 2,
  bg: p => rgba(p.theme.colors.alertRed, 0.05),
  borderRadius: 1,
})`
  border: ${p => `1px solid ${rgba(p.theme.colors.alertRed, 0.1)}`};
`

class RenderError extends PureComponent<Props> {
  handleCreateIssue = () => {
    const { error } = this.props
    if (!error) {
      return
    }
    const q = qs.stringify({
      title: `Error: ${error.message}`,
      body: `Error was thrown:

\`\`\`
${error.stack}
\`\`\`
`,
    })
    shell.openExternal(`https://github.com/LedgerHQ/ledger-live-desktop/issues/new?${q}`)
  }

  handleRestart = () => {
    remote.app.relaunch()
    remote.app.exit()
  }

  handleReset = () => {
    db.resetAll()
    this.handleRestart()
  }

  render() {
    const { error, t, disableExport, children } = this.props
    return (
      <Container>
        <Inner>
          <TranslatedError error={error} />
        </Inner>
        <Box horizontal flow={2}>
          <Button primary onClick={this.handleRestart}>
            {t('app:crash.restart')}
          </Button>
          <Button danger onClick={this.handleReset}>
            {t('app:crash.reset')}
          </Button>
          {!disableExport ? <ExportLogsBtn /> : null}
          <Button primary onClick={this.handleCreateIssue}>
            {t('app:crash.createTicket')}
          </Button>
        </Box>
        {children}
      </Container>
    )
  }
}

export default translate()(RenderError)
