import MapView from "../components/MapView.jsx";
import SectorPopup from "../components/SectorPopup.jsx";
import { useUi } from "../context/useUi.js";
import { SECTORS } from "../mocks/sectors.js";
import NewOsModal from "../modals/NewOsModal.jsx";

function MapaPage() {
  const {
    selectedSectorId,
    setSelectedSectorId,
    selectedSector,
    openModal,
  } = useUi();

  const handleSelectSector = (id) => {
    setSelectedSectorId(id);
  };

  const handleEmitOs = (setorNome) => {
    openModal(<NewOsModal initialSetor={setorNome} />);
  };

  return (
    <>
      <div className="hd">
        <div>
          <h1>Mapa de setores</h1>
          <span className="mu">
            Clique em um setor para ver ocorrências e emitir ordem.
          </span>
        </div>
      </div>
      <div className="map">
        <MapView
          sectors={SECTORS}
          selectedId={selectedSectorId}
          onSelect={handleSelectSector}
        />
        <SectorPopup sector={selectedSector} onEmitOs={handleEmitOs} />
      </div>
    </>
  );
}

export default MapaPage;