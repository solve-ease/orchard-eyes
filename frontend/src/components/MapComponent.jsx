import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap, Polygon } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { Search, Filter, Bug } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
const jawgMapKey = import.meta.env.VITE_JAWG_ACCESS_TOKEN
// Dummy data for pest and disease outbreaks
const outbreakData = [
  {
    id: 1,
    position: [51.505, -0.09],
    type: 'pest',
    severity: 'high',
    name: 'Codling Moth'
  },
  {
    id: 2,
    position: [51.51, -0.1],
    type: 'disease',
    severity: 'medium',
    name: 'Apple Scab'
  },
  {
    id: 3,
    position: [51.515, -0.09],
    type: 'pest',
    severity: 'low',
    name: 'Aphids'
  },
  {
    id: 4,
    position: [51.52, -0.08],
    type: 'disease',
    severity: 'high',
    name: 'Fire Blight'
  }
  // Add more dummy data points as needed
]

// Custom marker icons
const getOutbreakIcon = (type, severity) => {
  const color =
    severity === 'high' ? 'red' : severity === 'medium' ? 'yellow' : 'orange'
  const icon = type === 'pest' ? Bug : Bug

  return L.divIcon({
    html: `
      <div class="p-2 rounded-full ${
        severity === 'high'
          ? 'bg-red-500'
          : severity === 'medium'
            ? 'bg-yellow-500'
            : 'bg-orange-500'
      }">
        ${icon}
      </div>
    `,
    className: '',
    iconSize: [30, 30]
  })
}

// Custom icon for user location
const userLocationIcon = L.icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  iconSize: [32, 32], // size of the icon
  iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -32] // point from which the popup should open relative to the iconAnchor
})

// Map Controls Component
// const MapControls = ({ onSearch, onFilter, onThemeToggle }) => {
//   return (
//     <div className='absolute top-4 left-4 z-[1000] space-y-2'>
//       {/* <div className='bg-white rounded-lg shadow-lg p-2'>
//         <div className='flex items-center space-x-2'>
//           <input
//             type='text'
//             placeholder='Search location...'
//             className='px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
//             onChange={(e) => onSearch(e.target.value)}
//           />
//           <button
//             className='p-2 bg-gray-100 rounded-lg hover:bg-gray-200'
//             onClick={() => onFilter()}
//           >
//             <Filter className='w-5 h-5' />
//           </button>
//         </div>
//       </div> */}

//       <div className='bg-white rounded-lg shadow-lg p-2'>
//         <select
//           className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
//           onChange={(e) =>
//             onFilter({ type: 'severity', value: e.target.value })
//           }
//         >
//           <option value=''>All Severities</option>
//           <option value='high'>High</option>
//           <option value='medium'>Medium</option>
//           <option value='low'>Low</option>
//         </select>
//       </div>
//     </div>
//   )
// }

// Legend Component
// const Legend = () => {
//   return (
//     <div className='absolute bottom-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-4'>
//       <h3 className='font-semibold mb-2'>Legend</h3>
//       <div className='space-y-2'>
//         <div className='flex items-center space-x-2'>
//           <div className='w-4 h-4 rounded-full bg-red-500' />
//           <span>High Severity</span>
//         </div>
//         <div className='flex items-center space-x-2'>
//           <div className='w-4 h-4 rounded-full bg-yellow-500' />
//           <span>Medium Severity</span>
//         </div>
//         <div className='flex items-center space-x-2'>
//           <div className='w-4 h-4 rounded-full bg-orange-500' />
//           <span>Low Severity</span>
//         </div>
//       </div>
//     </div>
//   )
// }

const MapComponent = ({ userLocation }) => {
  const [theme, setTheme] = useState('light')
  const [filters, setFilters] = useState({})
  const [center, setCenter] = useState([31.0717047, 77.1899316])
  const zoom = 13
  useEffect(() => {
    if (!userLocation) return
    setCenter([userLocation.latitude, userLocation.longitude])
  }, [userLocation])
  const handleSearch = async (query) => {
    console.log('Searching for:', query)
  }

  const handleFilter = (filter) => {
    setFilters((prev) => ({ ...prev, [filter.type]: filter.value }))
  }

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))

  const filteredOutbreaks = outbreakData.filter((outbreak) => {
    if (filters.severity && outbreak.severity !== filters.severity) {
      return false
    }
    return true
  })

  // const tileLayerUrl =
  //   'https://api.jawg.io/static?zoom=12&center=48.856,2.351&size=400x300&layer=jawg-sunny&format=png&access-token=Y9Wf945CKUCY8eISt4rJ3mZBZoPyd43H1p3R2h33HkMNVInGHvMGH8TOcLG7kiyh'

  const tileLayerUrl = `https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=${jawgMapKey}`

  const farmBoundary = [
    [31.076255756458707, 77.18954920293633],
    [31.076837823259442, 77.1899402267676],
    [31.077117238570242, 77.19041224414816],
    [31.07620402309652, 77.19127813433913],
    [31.07624668285282, 77.19130338053453],
    [31.076415336432188, 77.19188311473636],
    [31.07665849059412, 77.19157999854016],
    [31.07588432896018, 77.19164801738923],
    [31.076118019131698, 77.19241677088037],
    [31.07614878299912, 77.1927069042814],
    [31.076206312906866, 77.19286506701822],
    [31.07579618367691, 77.19343434792157],
    [31.075617638876402, 77.19292241921183],
    [31.074883189719177, 77.193565935215],
    [31.074748848031618, 77.19363001423577],
    [31.074495026374052, 77.19361057237236],
    [31.074195225207795, 77.19401560626125],
    [31.074360774187465, 77.19408902122633],
    [31.073363127560867, 77.19440633592436],
    [31.07388558581859, 77.19443126358343],
    [31.07298275539482, 77.19496359266444],
    [31.07247053364799, 77.19437328867326],
    [31.072728385433003, 77.194863379512],
    [31.072471373467117, 77.19444485323417],
    [31.071543942293108, 77.19483134088532],
    [31.071443318510564, 77.19463401624682],
    [31.070943647734172, 77.1949974306785],
    [31.07142094807681, 77.19538106520429],
    [31.07123916232473, 77.19455383655142],
    [31.070610143423888, 77.1944080889743],
    [31.069725292158907, 77.19506524681564],
    [31.0695275836209, 77.19459289600395],
    [31.069306639546998, 77.19442688573038],
    [31.0693425885968, 77.19480883705498],
    [31.068914881910136, 77.19454496079915],
    [31.069257793882006, 77.19445029932062],
    [31.068927152599375, 77.19421694197622],
    [31.06845277380384, 77.19363248911984],
    [31.067906187082713, 77.19377890113797],
    [31.06781466425866, 77.19279604780998],
    [31.068025444302382, 77.19324268900355],
    [31.067064360826105, 77.19281674767461],
    [31.067765776801735, 77.19225609339921],
    [31.067590171943873, 77.19240276281589],
    [31.066641938583174, 77.19215036747077],
    [31.06684325160633, 77.19103530112397],
    [31.066944441806076, 77.19097810081797],
    [31.066883611348707, 77.19096195804251],
    [31.06654643691532, 77.1901356779916],
    [31.066861369401074, 77.19044373463262],
    [31.066742071562157, 77.19038030398812],
    [31.066463665294975, 77.18937231935915],
    [31.0667329686797, 77.18954109875676],
    [31.067229349085384, 77.18906043096231],
    [31.066363831214545, 77.1887578695981],
    [31.067157727133488, 77.18791521231296],
    [31.067290633939262, 77.18778036006383],
    [31.066737132520753, 77.18738873330399],
    [31.06726536499592, 77.18708471862445],
    [31.06798191332549, 77.18700252250059],
    [31.067620380534798, 77.18707138010396],
    [31.06754864102039, 77.18634617021357],
    [31.067928606568238, 77.18608368454645],
    [31.068049720609476, 77.18581717903135],
    [31.068102883417758, 77.18579211840861],
    [31.069232719908324, 77.18586405324915],
    [31.069499490835234, 77.18549085017807],
    [31.068910674817495, 77.18558137851635],
    [31.06959904615794, 77.18545977011705],
    [31.070360981781917, 77.18521787946962],
    [31.070099993396763, 77.18492131985055],
    [31.070188843808978, 77.18528264714948],
    [31.070588262205856, 77.18504461629844],
    [31.070774833437795, 77.1846424280212],
    [31.071428651014944, 77.18509417068607],
    [31.071571522584918, 77.18503807374519],
    [31.072250258105903, 77.1851042450389],
    [31.072056387704148, 77.18498109943626],
    [31.072813281396297, 77.1848868353924],
    [31.07295889787948, 77.18487134334775],
    [31.07350957537879, 77.18477580899167],
    [31.074026555781707, 77.18542345992955],
    [31.073482443612257, 77.18540465203763],
    [31.073956336666086, 77.18578313181584],
    [31.07408747888241, 77.18524847652533],
    [31.075004593203165, 77.18593253575567],
    [31.074661016758036, 77.18614261622331],
    [31.0751920793166, 77.18628792583385],
    [31.075332232717287, 77.18680767397808],
    [31.075126009269557, 77.18714223608693],
    [31.075821575914006, 77.18744947357547],
    [31.075665799084142, 77.18765783041103],
    [31.0761150881451, 77.18766710683781],
    [31.076582551020362, 77.18821468401552],
    [31.076777149862476, 77.18795713799001],
    [31.07670365954916, 77.18819014354673],
    [31.076998302044654, 77.18841864921872],
    [31.07628680954364, 77.18889187494885],
    [31.07681188262788, 77.18890222147934],
    [31.07640978829203, 77.18956124042059],
    [31.076255756458707, 77.18954920293633]
  ]

  return (
    <div className='relative h-[calc(100vh-4rem)] w-screen'>
      {/* <MapControls
        onSearch={handleSearch}
        onFilter={handleFilter}
        onThemeToggle={toggleTheme}
      /> */}
      {/* <Legend /> */}
      <MapContainer center={center} zoom={zoom} className='h-full w-full'>
        <TileLayer url={tileLayerUrl} />

        <Polygon
          positions={farmBoundary}
          pathOptions={{
            fillColor: 'red',
            color: '#893f05', // Border color
            fillOpacity: 0.3 // Translucent
          }}
        />
        <MarkerClusterGroup>
          {filteredOutbreaks.map((outbreak) => (
            <Marker
              key={outbreak.id}
              position={outbreak.position}
              icon={getOutbreakIcon(outbreak.type, outbreak.severity)}
            ></Marker>
          ))}
        </MarkerClusterGroup>
        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={userLocationIcon}
          ></Marker>
        )}
      </MapContainer>
    </div>
  )
}

export default MapComponent
