//

$( document ).on( "pagecreate", "body", function()
{
	$.ajaxSetup({beforeSend: function(xhr)
		{
			if (xhr.overrideMimeType)
			{
				xhr.overrideMimeType("application/json");
			}
		}
	});

	$.getJSON("index.json", function( data )
	{
		var index = elasticlunr.Index.load(data);
		$( "#autocomplete" ).on( "filterablebeforefilter", function ( e, data )
		{
			var $ul = $( this ),
				$input = $( data.input ),
				value = $input.val(),
				html = "";
			$ul.html( "" );
			if ( value && value.length > 3 )
			{
				$ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
				$ul.listview( "refresh" );
				var idx = index.search(value);
				$.each( idx, function ( i, val )
				{
					var text = index.documentStore.docs[val.ref].text;
					text = text.replace(value, "<span class='search-highlight'>"+value+"</span>");
					html += "<div data-role='collapsible'><h5>" + val.ref + "</h5><p>"+text+"</p></div>";
				});
				$ul.html( html );
				$ul.listview( "refresh" );
				$ul.trigger( "updatelayout");
				$ul.enhanceWithin();
			}
		});
	});
});
