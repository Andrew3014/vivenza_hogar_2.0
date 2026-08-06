import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

import AppLayout from '@/Layouts/AppLayout';
import PropertyMap from '@/Components/Map/PropertyMap';
import { formatCurrency } from '@/utils';


export default function Home({ properties = [] }) {

    const { auth } = usePage().props;


    const propertyList = Array.isArray(properties)
        ? properties
        : properties?.data ?? [];


    const [filters, setFilters] = useState({

        type:'',
        minPrice:'',
        maxPrice:'',
        bedrooms:'',
        search:''

    });


    const [expandedFilters,setExpandedFilters] = useState(false);



    /*
    ==========================
    FILTROS CLIENTE
    ==========================
    */


    const filteredProperties = propertyList.filter(property=>{


        if(filters.type &&
            property.type !== filters.type
        ){
            return false;
        }


        if(
            filters.minPrice &&
            property.price < Number(filters.minPrice)
        ){
            return false;
        }


        if(
            filters.maxPrice &&
            property.price > Number(filters.maxPrice)
        ){
            return false;
        }



        if(
            filters.bedrooms &&
            property.bedrooms < Number(filters.bedrooms)
        ){
            return false;
        }



        if(filters.search){

            const text =
            filters.search.toLowerCase();


            return (

                property.title
                ?.toLowerCase()
                .includes(text)

                ||

                property.description
                ?.toLowerCase()
                .includes(text)

                ||

                property.location?.city
                ?.toLowerCase()
                .includes(text)

            );

        }


        return true;

    });



    const handleFilterChange=(e)=>{


        setFilters({

            ...filters,

            [e.target.name]:
            e.target.value

        });

    };



    const applyServerFilters=()=>{


        router.get(

            route('properties.index'),

            {

                transaction_type:
                filters.type || undefined,


                min_price:
                filters.minPrice || undefined,


                max_price:
                filters.maxPrice || undefined,


                bedrooms:
                filters.bedrooms || undefined,


                search:
                filters.search || undefined

            },

            {

                preserveState:true,
                preserveScroll:true,
                replace:true

            }

        );


    };



    const clearFilters=()=>{


        setFilters({

            type:'',
            minPrice:'',
            maxPrice:'',
            bedrooms:'',
            search:''

        });


    };




return (

<AppLayout>


<div>



{/* ================= HERO ================= */}

{/* ================= CATEGORÍAS INMOBILIARIAS ================= */}

<section className="vz-category-section">

    <div className="vz-container">

        <div className="vz-category-grid">


            <Link
                href={route('properties.index', {
                    transaction_type:'venta'
                })}
                className="vz-category-card"
            >

                <div className="vz-category-icon">
                    🏠
                </div>

                <h3>
                    Venta
                </h3>

                <p>
                    Compra casas, departamentos y terrenos.
                </p>

            </Link>

            <Link
                href={route('properties.index', {
                    transaction_type:'alquiler'
                })}
                className="vz-category-card"
            >

                <div className="vz-category-icon">
                    🔑
                </div>

                <h3>
                    Alquiler
                </h3>

                <p>
                    Encuentra tu próximo hogar temporal.
                </p>

            </Link>





            <Link
                href={route('properties.index', {
                    transaction_type:'alquiler_diario'
                })}
                className="vz-category-card"
            >

                <div className="vz-category-icon">
                    🏨
                </div>

                <h3>
                    Alquiler por días
                </h3>

                <p>
                    Alojamientos para vacaciones y viajes.
                </p>

            </Link>





            <Link
                href={route('properties.index', {
                    transaction_type:'anticretico'
                })}
                className="vz-category-card"
            >

                <div className="vz-category-icon">
                    📄
                </div>

                <h3>
                    Anticrético
                </h3>

                <p>
                    Contratos inmobiliarios a largo plazo.
                </p>

            </Link>


        </div>

    </div>

</section>

<section className="vz-hero">


<div className="vz-container">


<h1>

🏠 Vivenza Inmobiliaria

</h1>


<p>

Encuentra tu próximo hogar o invierte con confianza

</p>


</div>


</section>





{/* ================= BUSCADOR ================= */}



<section className="vz-search">


<div className="vz-container">


<div className="grid md:grid-cols-4 gap-4">



<select

name="type"

value={filters.type}

onChange={handleFilterChange}

className="vz-input"

>


<option value="">
Comprar
</option>


<option value="venta">
Venta
</option>


<option value="alquiler">
Alquiler
</option>


<option value="anticretico">
Anticrético
</option>



</select>




<input

type="text"

name="search"

value={filters.search}

onChange={handleFilterChange}

placeholder="Buscar ciudad, dirección o propiedad"

className="vz-input"

/>




<select

name="bedrooms"

value={filters.bedrooms}

onChange={handleFilterChange}

className="vz-input"

>


<option value="">
Dormitorios
</option>


<option value="1">
1+
</option>


<option value="2">
2+
</option>


<option value="3">
3+
</option>


<option value="4">
4+
</option>



</select>





<button

onClick={applyServerFilters}

className="vz-btn-success"

>

🔍 Buscar

</button>



</div>


</div>


</section>






{/* ================= CONTENIDO ================= */}



<section className="vz-container py-10">


<div className="grid lg:grid-cols-4 gap-8">





{/* ================= SIDEBAR ================= */}



<aside>


<div className="vz-sidebar">


<h3 className="font-bold text-xl mb-5">

Filtros

</h3>



<label>

Precio mínimo

</label>


<input

type="number"

name="minPrice"

value={filters.minPrice}

onChange={handleFilterChange}

className="vz-input mb-3"

/>





<label>

Precio máximo

</label>


<input

type="number"

name="maxPrice"

value={filters.maxPrice}

onChange={handleFilterChange}

className="vz-input mb-4"

/>






<h4 className="font-bold mt-5 mb-2">

Tipo

</h4>



<select

name="type"

value={filters.type}

onChange={handleFilterChange}

className="vz-input"

>


<option value="">
Todos
</option>


<option value="venta">
Venta
</option>


<option value="alquiler">
Alquiler
</option>


</select>





<button

onClick={()=>setExpandedFilters(!expandedFilters)}

className="mt-5 font-bold"

>

Más opciones ▼

</button>




{
expandedFilters &&

<div className="mt-4">


<p className="text-gray-600">

Más filtros próximamente

</p>


</div>

}





<button

onClick={applyServerFilters}

className="vz-btn-success w-full mt-5"

>

Aplicar filtros

</button>




<button

onClick={clearFilters}

className="w-full mt-3 bg-gray-300 p-3 rounded"

>

Limpiar

</button>




</div>


</aside>





{/* ================= LISTADO ================= */}



<main className="lg:col-span-3">


<h2 className="text-3xl font-bold mb-6">

Propiedades disponibles

</h2>



{filteredProperties.length > 0 && (
    <PropertyMap 
        properties={filteredProperties}
    />
)}



<div className="mt-8">

<h3 className="text-xl font-bold mb-5">

Resultados:
{filteredProperties.length}

</h3>


<div className="vz-property-grid">

{filteredProperties.map((property)=>(

<div 
    key={property.id}
    className="vz-card"
>

    <div className="vz-property-image">
        📷
    </div>


    <div className="vz-card-body">

        <p className="text-gray-500 text-sm mb-2">
            {property.location?.city || 'Ubicación no disponible'}
        </p>


        <h3 className="font-bold text-xl mb-3">
            {property.title}
        </h3>


        <div className="flex gap-4 text-sm mb-4">

            {
            property.bedrooms &&
            <span>
                🛏 {property.bedrooms} Hab.
            </span>
            }


            {
            property.bathrooms &&
            <span>
                🚿 {property.bathrooms} Baños
            </span>
            }


            {
            property.area &&
            <span>
                📐 {property.area} m²
            </span>
            }

        </div>



        <div className="flex justify-between items-center">

            <strong className="text-xl">
                {formatCurrency(property.price)}
            </strong>


            <Link
                href={route(
                    'properties.show',
                    property.id
                )}
                className="text-blue-600 font-bold"
            >
                Ver →
            </Link>

        </div>


    </div>


</div>

))}

</div>

</div>

</main>


</div>


</section>





{/* ================= ESTADISTICAS ================= */}



{
filteredProperties.length > 0 &&


<section className="vz-container py-10">


<div className="vz-card">


<div className="vz-card-body grid md:grid-cols-3 gap-8 text-center">



<div>

<h3 className="text-3xl font-bold">

{filteredProperties.length}

</h3>

<p>

Propiedades encontradas

</p>

</div>




<div>

<h3 className="text-3xl font-bold">


{
formatCurrency(
Math.min(
...filteredProperties.map(
p=>p.price
)
)
)

}


</h3>


<p>

Precio menor

</p>


</div>





<div>


<h3 className="text-3xl font-bold">


{
formatCurrency(
Math.max(
...filteredProperties.map(
p=>p.price
)
)
)

}


</h3>


<p>

Precio mayor

</p>


</div>



</div>


</div>


</section>


}







{/* ================= CTA ================= */}



{
!auth?.user &&


<section className="vz-hero">


<div className="vz-container text-center">


<h2 className="text-3xl font-bold mb-4">

¿Eres agente inmobiliario?

</h2>


<p className="mb-6">

Publica tus propiedades y llega a más clientes.

</p>



<div className="flex justify-center gap-4">


<Link

href={route('plans.index')}

className="bg-white text-blue-600 px-6 py-3 rounded font-bold"

>

Ver planes

</Link>




<Link

href={route('register')}

className="vz-btn-primary"

>

Registrarse

</Link>



</div>



</div>


</section>


}

</div>


</AppLayout>


);


}
