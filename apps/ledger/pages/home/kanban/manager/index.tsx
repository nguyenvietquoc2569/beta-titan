import { LedgerLayout } from '@beta-titan/ledger/frontend/utilities/ui-layout-fe';
import { KanbanManagerPage } from '@beta-titan/ledger/frontend/kanban'

export default function KanbanManager () {
  return <LedgerLayout>
      <KanbanManagerPage></KanbanManagerPage>
  </LedgerLayout>
}
