<textarea style="width: 600px; height: 800px">
<?php
	/*
		Because Visual Studio really likes to screw up its csproj files a LOT
		let's read in the _definitions.ts file and generate a valid csproj XML block,
		so we can be 100% sure it's in the order we need and formatted cleanly.

		Note: VS still won't compile to the JS files if we have the output parameter set in
		the csproj. You have to edit that out to compile to JS, the edit it back in to compile
		to a single output destination! Ballache for sure. But at least we only do it when
		generating new docs.
	*/

	$defs = file('_definitions.ts');

	echo "  <ItemGroup>\n";
	echo "    <TypeScriptCompile Include=\"_definitions.ts\" />\n";

	for ($i = 0; $i < count($defs); $i++)
	{
		//	Format of the line: /// <reference path="Phaser.ts" />

		if (strlen(trim($defs[$i])) > 0)
		{
			$ts = substr($defs[$i], 21, -6);
			$ts = str_replace('/', '\\', $ts);
			$js = str_replace('.ts', '.js', $ts);

			if (strrpos($ts, '\\') > 0)
			{
				$file = substr($ts, strrpos($ts, '\\') + 1);
			}
			else
			{
				$file = substr($ts, strrpos($ts, '\\'));
			}

/*
  <ItemGroup>
    <TypeScriptCompile Include="physics\arcade\Motion.ts" />
  </ItemGroup>
  <ItemGroup>
    <Content Include="physics\arcade\Motion.js">
      <DependentUpon>Motion.ts</DependentUpon>
    </Content>
  </ItemGroup>
*/

			echo "    <TypeScriptCompile Include=\"$ts\" />\n";
			//echo "    <Content Include=\"$js\">\n";
			//echo "      <DependentUpon>$file</DependentUpon>\n";
			//echo "    </Content>\n";
		}

	}

	echo "  </ItemGroup>\n";

?>
</textarea>