import React, { useState } from 'react';
import EditEquipment from './_SNB.EditEquipment';

function ParentComponent() {
  // Initialize the equipment and edit mode states
  const [equipment, setEquipment] = useState<{ [key: string]: number }>({});
  const [editMode, setEditMode] = useState(false);

  return (
    <div>
      {editMode ? (
        <EditEquipment setEquipment={setEquipment} setEditMode={setEditMode} />
      ) : (
        <div>
          {/* You can display the current equipment or any other information here */}
          <button onClick={() => setEditMode(true)}>Edit Equipment</button>
          <pre>{JSON.stringify(equipment, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default ParentComponent;
