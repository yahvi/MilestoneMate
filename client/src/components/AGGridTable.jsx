import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// Register AG Grid Community modules
ModuleRegistry.registerModules([AllCommunityModule]);

export default function AGGridTable({
  rowData = [],
  columnDefs = [],
  pagination = true,
  paginationPageSize = 10,
  quickFilterText = '',
  onRowClicked,
  height = '420px',
}) {
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      floatingFilter: false,
      flex: 1,
      minWidth: 120,
    }),
    []
  );

  return (
    <div className="w-full bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
      <div style={{ height, width: '100%' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={pagination}
          paginationPageSize={paginationPageSize}
          paginationPageSizeSelector={[5, 10, 20, 50]}
          quickFilterText={quickFilterText}
          onRowClicked={onRowClicked}
          rowSelection={{ mode: 'singleRow' }}
          animateRows={true}
          suppressCellFocus={true}
        />
      </div>
    </div>
  );
}
