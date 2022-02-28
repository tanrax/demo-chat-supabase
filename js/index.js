import { createApp } from './vue.esm-browser.js'

const supabaseUrl = 'https://zvibbkrmxzodtvfnuwvv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2aWJia3JteHpvZHR2Zm51d3Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDYwMzkxMDYsImV4cCI6MTk2MTYxNTEwNn0.-BdYQsN7CuX_2kfgT-hEQZ_zqHUuEXAcJsOKrapOeyM'

const cli = supabase.createClient(supabaseUrl, supabaseKey)

createApp({
    data() {
        return {
            mensajes: [],
            nombre: '',
            nuevoMensaje: ''
        }
    },
    methods: {
        cargarMensajes: async function() {
            let { data: data, error } = await cli
                .from('Mensajes')
                .select('*')
                .order('created_at', { ascending: true })
            this.mensajes = data;
        },
        enviarMensaje: async function () {
            const { data, error } = await cli
                .from('Mensajes')
                .insert([
                    { nombre: this.nombre, texto: this.nuevoMensaje }
                ])
            // Limpiamos el mensanje
            this.nuevoMensaje = '';
        },
        escucharNuevosMensajes: function () {
            cli
                .from('Mensajes')
                .on('INSERT', payload => {
                    this.mensajes.push(payload.new);
                })
                .subscribe()
        }
    },
    mounted() {
        this.cargarMensajes();
        this.escucharNuevosMensajes();
    }
}).mount('#app')