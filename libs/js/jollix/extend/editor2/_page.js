prepEditor2('_page','insert,update',{
    level: %levelSuper,
    lschema: {
        'urlpart':{
            _type: 'urlpart',
            _flag: 'unique,required'
        },
        'title':{
            _type:'text',
            required: true
        },
        'keywords':'text',
        'tags':'taglist',
        'description':'textarea',
        'content':'rich',
        'views':'number'
    },
    schema: {
        'is_published':'bool',
        'params': {
            sm: {
                freq: 'number',
                prio: 'number'
            },
            show_picture: 'bool'
        },
        'media_id':{
            _type:'image',
            file: {
                thumb:   '40x40x2'
            }
        }
    },
    group: {
//-        g_content: {
//-            title: 'main content',
//-            fields: 'content,media_id'
//-        },
        g_seo: {
            title: 'seo',
            fields: 'urlpart,title,keywords,tags,description'
        },
        g_settings: {
            title: 'settings',
            fields: 'is_published,params.show_picture'
        },
        g_sitemap: {
            title: 'sitemap',
            fields: 'params.sm',
            level:%levelModerator
        },
        g_statistics: {
            title: 'statistics',
            fields: 'views',
            level:%levelAdmin
        }
    },
    order: 'g_statistics,g_settings,g_seo,content,g_sitemap',
    defaultObject: {
        is_published: true,
        params: {
            show_picture: true
        }
    }
});




















