import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';

import AppLayout from '@/Layouts/AppLayout';
import { formatCurrency } from '@/utils';


export default function PlansIndex({ userPlans = null }) {

    const { auth } = usePage().props;

    const [billingPeriod, setBillingPeriod] = useState('monthly');


    const plans = [
        {
            id: 'basico',
            name: '🚀 Básico',
            price: 50,
            yearlyPrice: 500,
            max_properties: 5,
            description: 'Perfecto para comenzar',
            highlighted: false,

            features:[
                {name:'Hasta 5 propiedades', included:true},
                {name:'Publicación de propiedades', included:true},
                {name:'Propiedades destacadas', included:false},
                {name:'Soporte por email', included:true},
                {name:'Estadísticas básicas', included:false},
                {name:'AppStore', included:false},
            ]
        },


        {
            id:'profesional',
            name:'💼 Profesional',
            price:150,
            yearlyPrice:1500,
            max_properties:20,
            description:'Para agentes inmobiliarios',
            highlighted:true,
            badge:'Más Popular',

            features:[
                {name:'Hasta 20 propiedades', included:true},
                {name:'Publicación de propiedades', included:true},
                {name:'Propiedades destacadas (5)', included:true},
                {name:'Soporte prioritario', included:true},
                {name:'Estadísticas detalladas', included:true},
                {name:'AppStore', included:false},
            ]
        },


        {
            id:'enterprise',
            name:'🏢 Enterprise',
            price:500,
            yearlyPrice:5000,
            max_properties:100,
            description:'Para agencias inmobiliarias',
            highlighted:false,

            features:[
                {name:'Hasta 100 propiedades', included:true},
                {name:'Publicación de propiedades', included:true},
                {name:'Propiedades destacadas ilimitadas', included:true},
                {name:'Soporte 24/7 telefónico', included:true},
                {name:'Estadísticas avanzadas', included:true},
                {name:'App Store iOS/Android', included:true},
            ]
        }

    ];



    const getPrice=(plan)=>{

        return billingPeriod==='yearly'
            ? plan.yearlyPrice
            : plan.price;

    };



    const handleBuyClick=(plan)=>{


        if(!auth?.user){

            window.location.href=route('login');
            return;

        }


        const message =
        `Hola, quisiera contratar el plan ${plan.name}`;


        window.open(
            `https://wa.me/59169422021?text=${encodeURIComponent(message)}`,
            '_blank'
        );

    };




return (

<AppLayout>


<div className="vz-page">


<section className="vz-hero">


<div className="vz-container vz-text-center">


<h1>
📦 Planes de Suscripción
</h1>


<p>
Elige el plan perfecto para tus necesidades inmobiliarias
</p>



<div className="vz-billing-toggle">


<button
className={
billingPeriod==='monthly'
?'vz-billing-active'
:'vz-billing-btn'
}

onClick={()=>setBillingPeriod('monthly')}
>
📅 Mensual
</button>



<button

className={
billingPeriod==='yearly'
?'vz-billing-active'
:'vz-billing-btn'
}

onClick={()=>setBillingPeriod('yearly')}

>
📅 Anual
</button>


</div>


</div>


</section>





<section className="vz-container vz-section">


<div className="vz-plans-grid">


{plans.map(plan=>(


<div

key={plan.id}

className={
plan.highlighted
?'vz-plan-card vz-plan-featured'
:'vz-plan-card'
}

>


{plan.badge &&

<div className="vz-plan-badge">

⭐ {plan.badge}

</div>

}



<div className="vz-plan-header">


<h2>
{plan.name}
</h2>


<p>
{plan.description}
</p>


</div>





<div className="vz-plan-price">


<strong>

{
formatCurrency(
getPrice(plan)
)

}

</strong>


<span>

{billingPeriod==='yearly'
?'/año'
:'/mes'}

</span>


</div>



<div className="vz-plan-features">

<h4>
✨ Características
</h4>


<div className="vz-feature-list">


{plan.features.map((feature,index)=>(


<div 
key={index}
className={
feature.included
?'vz-feature included'
:'vz-feature disabled'
}
>


<span>

{
feature.included
?'✅'
:'❌'
}

</span>


<p>
{feature.name}
</p>


</div>


))}


</div>


</div>





<div className="vz-plan-footer">


<button

onClick={()=>handleBuyClick(plan)}

className={
plan.highlighted
?'vz-btn-success vz-btn-lg'
:'vz-btn-outline vz-btn-lg'
}

>

💬 Comprar Plan

</button>



<p className="vz-small-text">

Te contactaremos por WhatsApp

</p>


</div>


</div>


))}


</div>


</section>







{/* ================= COMPARATIVA ================= */}


<section className="vz-container vz-section">


<h2 className="vz-section-title">

📊 Comparativa de Planes

</h2>



<div className="vz-table-card">


<div className="vz-table-responsive">


<table className="vz-table">


<thead>


<tr>


<th>
Características
</th>


{
plans.map(plan=>(

<th key={plan.id}>

{plan.name}

</th>

))

}


</tr>


</thead>



<tbody>



<tr>

<td>
Propiedades
</td>


{
plans.map(plan=>(

<td key={plan.id}>

<strong className="vz-number-highlight">

{plan.max_properties}

</strong>

</td>

))

}


</tr>




<tr>

<td>
Destacadas
</td>


{
plans.map(plan=>(


<td key={plan.id}>


{
plan.id==='basico'
&& '❌'
}


{
plan.id==='profesional'
&& '✅ 5/mes'
}


{
plan.id==='enterprise'
&& '✅ Ilimitadas'
}



</td>


))

}


</tr>





<tr>


<td>
Soporte
</td>



{
plans.map(plan=>(


<td key={plan.id}>


{
plan.id==='basico'
&& 'Email'
}


{
plan.id==='profesional'
&& 'Prioritario'
}


{
plan.id==='enterprise'
&& '24/7'
}


</td>


))

}



</tr>







<tr>


<td>
Estadísticas
</td>



{
plans.map(plan=>(


<td key={plan.id}>


{
plan.id==='basico'
&& '❌'
}


{
plan.id==='profesional'
&& '✅ Detalladas'
}


{
plan.id==='enterprise'
&& '✅ Avanzadas'
}



</td>


))

}



</tr>



</tbody>


</table>


</div>


</div>



</section>
{/* ================= FAQ ================= */}


<section className="vz-container vz-section">


<div className="vz-card">


<div className="vz-card-body">


<h2 className="vz-section-title">

❓ Preguntas Frecuentes

</h2>




<div className="vz-faq-grid">



<div className="vz-faq-item">


<h3>
💳 ¿Cómo funciona el pago?
</h3>


<p>

Te contactaremos por WhatsApp para procesar tu pago de forma segura.
Aceptamos transferencias bancarias, depósitos y métodos locales.

</p>


</div>





<div className="vz-faq-item">


<h3>
🔄 ¿Puedo cambiar de plan?
</h3>


<p>

Sí, puedes actualizar o cambiar tu plan en cualquier momento.

</p>


</div>







<div className="vz-faq-item">


<h3>
❌ ¿Hay descuentos por cancelación?
</h3>


<p>

Puedes cancelar cuando lo necesites sin penalizaciones.

</p>


</div>







<div className="vz-faq-item">


<h3>
⭐ ¿Qué son las propiedades destacadas?
</h3>


<p>

Son propiedades que aparecen primero en las búsquedas y reciben mayor visibilidad.

</p>


</div>







<div className="vz-faq-item">


<h3>
📝 ¿Incluye apoyo en la publicación?
</h3>


<p>

El plan Enterprise incluye asistencia personalizada para optimizar anuncios.

</p>


</div>







<div className="vz-faq-item">


<h3>
📱 ¿Existe aplicación móvil?
</h3>


<p>

El plan Enterprise incluye acceso a aplicaciones móviles para gestionar propiedades.

</p>


</div>




</div>


</div>


</div>


</section>







{/* ================= CTA FINAL ================= */}



<section className="vz-hero">


<div className="vz-container vz-text-center">


<h2>

🚀 ¿Listo para comenzar?

</h2>



<p>

Únete a agentes inmobiliarios que ya están vendiendo más propiedades.

</p>




<button


onClick={()=>{


if(!auth?.user){

window.location.href=route('login');

return;

}



const plan =
plans.find(
p=>p.id==='profesional'
);



const message =
`Hola, quisiera contratar el plan ${plan.name}`;



window.open(

`https://wa.me/59169422021?text=${encodeURIComponent(message)}`,

'_blank'

);



}}



className="vz-btn-success vz-btn-lg"

>


💬 Hablar con Ventas


</button>




</div>


</section>





</div>


</AppLayout>

);


}
